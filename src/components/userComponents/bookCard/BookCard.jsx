"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import { useToast } from "../../../contexts/ToastContext"
import { mockImages } from "../../../mockData" // Import mockImages
import styles from "./BookCard.module.css"

const BookCard = ({ book }) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  // Tìm hình ảnh cover cho sách từ bảng images
  const getCoverImage = (bookId) => {
    const coverImage = mockImages.find((img) => img.product_id === bookId && img.is_cover)
    return coverImage ? coverImage.url : "/placeholder.svg?height=300&width=200"
  }

  // Sửa lại hàm handleAddToCart để tránh hiển thị toast hai lần
  // Thay thế hàm handleAddToCart hiện tại bằng hàm này:

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!addedToCart && book.stock > 0) {
      addToCart(book)
      setAddedToCart(true)

      // Reset added state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 2000)
    }
  }

  // Calculate discounted price if there's a discount
  const discountedPrice = book.discount > 0 ? book.rental_price - (book.rental_price * book.discount) / 100 : null

  return (
    <div className={styles.bookCard} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/books/${book.id}`} className={styles.bookLink}>
        <div className={styles.imageContainer}>
          <img src={getCoverImage(book.id) || "/placeholder.svg"} alt={book.title} className={styles.bookImage} />

          {book.stock <= 0 && <div className={styles.outOfStock}>Hết sách</div>}

          {book.discount > 0 && <div className={styles.discountBadge}>-{book.discount}%</div>}

          {isHovered && book.stock > 0 && (
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
          <p className={styles.bookAuthor}>{book.author_name || "Tác giả không xác định"}</p>
          <div className={styles.bookPrice}>
            {discountedPrice ? (
              <>
                <span className={styles.discountedPrice}>{Math.round(discountedPrice).toLocaleString("vi-VN")}đ</span>
                <span className={styles.originalPrice}>{book.rental_price.toLocaleString("vi-VN")}đ</span>
              </>
            ) : (
              <span>{book.rental_price.toLocaleString("vi-VN")}đ</span>
            )}
            <span className={styles.rentalPeriod}>/tuần</span>
          </div>
        </div>
      </Link>

      {book.stock > 0 && (
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
