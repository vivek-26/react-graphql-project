/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * @license MIT
 */

import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import { getBooksQuery } from '../queries';
import BookDetails from './BookDetails';

class BookList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
  }

  renderBooks() {
    const { data } = this.props;

    if (data.loading) {
      return <div>Loading Books</div>;
    }

    return data.books.map((book) => {
      return (
        <li key={book.id} onClick={(e) => this.setState({ selected: book.id })}>
          {book.name}
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <ul id="book-list">{this.renderBooks()}</ul>
        <BookDetails bookId={this.state.selected} />
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
