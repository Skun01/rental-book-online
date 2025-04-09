"use client"

import { Link } from "react-router-dom"
import { useCart } from "../../../contexts/CartContext"
import { ShoppingCart } from "lucide-react"
import "./BookCard.css"

const BookCard = ({ book }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(book)
  }

  const authorName = book.authors && book.authors.length > 0 
    ? book.authors[0].name 
    : "Tác giả không xác định"

  const coverImage = book.images && book.images.length > 0 
    ? book.images.find(img => img.is_cover)?.url 
    : "/placeholder.svg?height=300&width=200"

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-image">
        <img src={coverImage || "/placeholder.svg"} alt={book.title} />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{authorName}</p>
        <div className="book-price">
          <span>Giá thuê: {book.rental_price} VNĐ</span>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  )
}

export default BookCard
