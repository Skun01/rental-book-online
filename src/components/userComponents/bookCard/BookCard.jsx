"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Heart, Eye, Check } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import styles from "./BookCard.module.css"

const BookCard = ({ book }) => {
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
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

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }
  
  return (
    <div 
      className={styles.bookCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/books/${book.id}`} className={styles.bookCardLink}>
        <div className={styles.imageWrapper}>
          <img
            src={book.cover_image || "/placeholder.svg?height=300&width=200"}
            alt={book.title}
            className={styles.coverImage}
            loading="lazy"
          />
          
          {book.available_quantity <= 0 && (
            <div className={styles.outOfStockBadge}>Hết sách</div>
          )}
          
          {book.discount > 0 && (
            <div className={styles.discountBadge}>-{book.discount}%</div>
          )}
          
          {isHovered && book.available_quantity > 0 && (
            <div className={styles.quickActions}>
              <button 
                className={styles.quickActionButton}
                onClick={handleAddToCart}
                aria-label="Thêm vào giỏ hàng"
              >
                <ShoppingCart size={18} />
              </button>
              <Link 
                to={`/books/${book.id}`}
                className={styles.quickActionButton}
                aria-label="Xem chi tiết"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={18} />
              </Link>
              <button 
                className={styles.quickActionButton}
                aria-label="Yêu thích"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Handle wishlist logic here
                }}
              >
                <Heart size={18} />
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.bookInfo}>
          <div className={styles.bookCategory}>{book.category || 'Văn học'}</div>
          <h3 className={styles.bookTitle} title={book.title}>
            {truncateTitle(book.title)}
          </h3>
          <p className={styles.bookAuthor}>Tác giả: {book.author}</p>
          
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(book.rating || 0) ? styles.starFilled : styles.starEmpty}>★</span>
              ))}
            </div>
            <span className={styles.ratingCount}>({book.review_count || 0})</span>
          </div>
          
          <div className={styles.priceContainer}>
            <div className={styles.rentalPrice}>
              {book.rental_price?.toLocaleString("vi-VN")}đ
              <span className={styles.rentalPeriod}>/tuần</span>
            </div>
            <div className={styles.depositPrice}>
              Đặt cọc: {book.deposit_price?.toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>
      </Link>
      
      <div className={styles.cardFooter}>
        {book.available_quantity > 0 ? (
          <button
            className={`${styles.addToCartButton} ${addedToCart ? styles.added : ""}`}
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? (
              <>
                <Check size={16} className={styles.checkIcon} />
                <span>Đã thêm vào giỏ</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>
        ) : (
          <button
            className={styles.outOfStockButton}
            disabled
          >
            <span>Hết sách</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default BookCard