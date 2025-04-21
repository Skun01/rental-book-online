"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import styles from "./BookCard.module.css"

const BookCard = ({ book }) => {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!addedToCart && book.available_quantity > 0) {
      addToCart(book)
      setAddedToCart(true)

      // Reset added state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 2000)
    }
  }

  return (
    <div className={styles.bookCard} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/books/${book.id}`} className={styles.bookLink}>
        <div className={styles.imageContainer}>
          <img
            src={book.cover_image || "/placeholder.svg?height=300&width=200"}
            alt={book.title}
            className={styles.bookImage}
          />

          {book.available_quantity <= 0 && <div className={styles.outOfStock}>Hết sách</div>}

          {isHovered && book.available_quantity > 0 && (
            <div className={styles.quickActions}>
              <button
                className={`${styles.actionButton} ${addedToCart ? styles.added : ""}`}
                onClick={handleAddToCart}
                disabled={addedToCart}
                aria-label="Thêm vào giỏ hàng"
              >
                <ShoppingCart size={16} />
              </button>
              <Link to={`/books/${book.id}`} className={styles.actionButton} aria-label="Xem chi tiết">
                <Eye size={16} />
              </Link>
            </div>
          )}
        </div>

        <div className={styles.bookInfo}>
          <h3 className={styles.bookTitle}>{book.title}</h3>
          <p className={styles.bookAuthor}>{book.author}</p>
          <div className={styles.bookPrice}>
            <span>{book.rental_price.toLocaleString("vi-VN")}đ</span>
            <span className={styles.rentalPeriod}>/tuần</span>
          </div>
        </div>
      </Link>

      {book.available_quantity > 0 && (
        <button
          className={`${styles.addToCartButton} ${addedToCart ? styles.added : ""}`}
          onClick={handleAddToCart}
          disabled={addedToCart}
        >
          {addedToCart ? (
            <>
              <ShoppingCart size={16} />
              <span>Đã thêm vào giỏ</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default BookCard
