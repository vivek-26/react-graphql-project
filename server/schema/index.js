/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * @license MIT
 */

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const { find, filter } = require('lodash');

const Book = require('models/book');
const Author = require('models/author');

const { debugNs } = require('config');
const debug = require('debug')(`${debugNs}:server-schema`);

/* Book Type Definition */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent) {
        /* `parent` prop refers to Book Object */
        debug('Book Type Author Field', parent);
        return Author.findById(parent.authorId);
      },
    },
  }),
});

/* Author Type Definition */
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent) {
        /* `parent` prop refers to Book Object */
        debug('Author Type Book Field', parent);
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

/* RootQuery - Entry point to graph */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(undefined, args) {
        /**
         * Code to get data from DB / other sources
         * Note: Args automatically get converted to string in
         * `resolve` function
         */
        debug('Book Resolver: Args', args);
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(undefined, args) {
        debug('Author Resolver: Args', args);
        return Author.findById(args.id);
      },
    },
    books: {
      type: GraphQLList(BookType),
      resolve() {
        return Book.find({});
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve() {
        return Author.find({});
      },
    },
  },
});

/* Mutations - Add / Edit Data */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(undefined, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });

        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(undefined, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });

        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
