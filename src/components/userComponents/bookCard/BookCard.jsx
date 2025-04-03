"use client"

import { Link } from "react-router-dom"
// import { useCart } from "../contexts/CartContext"
import "./BookCard.css"

const BookCard = ({ book }) => {
//   const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // addToCart(book)
  }

  // Calculate discount price if applicable
  const discountedPrice = book.discount > 0 ? book.price - (book.price * book.discount) / 100 : null

  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="book-image">
        <img src={book.image || "/placeholder.svg"} alt={book.name} />
        {book.discount > 0 && <div className="discount-badge">-{book.discount}%</div>}
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-price">
          {discountedPrice ? (
            <>
              <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
              <span className="original-price">${book.price.toFixed(2)}</span>
            </>
          ) : (
            <span>${book.price.toFixed(2)}</span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

export default BookCard

