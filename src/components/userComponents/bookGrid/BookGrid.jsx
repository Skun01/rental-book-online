import React from 'react';
import styles from './BookGrid.module.css';
import BookCard from '../bookCard/BookCard';

const BookGrid = ({ books, bookCardType = "small" }) => {
  console.log(books);
  return(
    <div className={styles.bookGrid}>
      {books.map((book) => (
        <div key={book.id} className={styles.bookCardContainer}>
          <BookCard book={book} smaller = {bookCardType === "small" ? true : false} />
        </div>
      ))}
    </div>
  )
};

export default BookGrid;