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
} = require('graphql');

const { find, filter } = require('lodash');
const { debugNs } = require('config');
const debug = require('debug')(`${debugNs}:server-schema`);

// Dummy data
const books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

const authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

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
        return find(authors, { id: parent.authorId });
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
        return filter(books, { authorId: parent.id });
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
      resolve(parents, args) {
        /**
         * Code to get data from DB / other sources
         * Note: Args automatically get converted to string in
         * `resolve` function
         */
        debug('Book Resolver: Args', args);
        return find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(undefined, args) {
        debug('Author Resolver: Args', args);
        return find(authors, { id: args.id });
      },
    },
    books: {
      type: GraphQLList(BookType),
      resolve() {
        return books;
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve() {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
