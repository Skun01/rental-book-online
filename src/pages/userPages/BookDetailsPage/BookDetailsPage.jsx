"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ShoppingCart, Heart, Share2, ArrowLeft, Check } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import { mockBooks, mockCategories, mockAuthors } from "../../../mockData"
import styles from "./BookDetailsPage.module.css"

const BookDetailsPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState(null)
  const [author, setAuthor] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    // Reset state when id changes
    setBook(null)
    setLoading(true)
    setError(null)
    setQuantity(1)
    setAddedToCart(false)

    // In a real app, this would be an API call
    const fetchBook = () => {
      try {
        const foundBook = mockBooks.find((book) => book.id === Number.parseInt(id))

        if (!foundBook) {
          throw new Error("Không tìm thấy sách")
        }

        setBook(foundBook)

        // Get category
        const foundCategory = mockCategories.find((cat) => cat.id === foundBook.category_id)
        setCategory(foundCategory)

        // Get author (in a real app, this would be from book_author relation)
        const authorName = foundBook.author
        const foundAuthor = mockAuthors.find((auth) => auth.name === authorName)
        setAuthor(foundAuthor)

        // Get related books (same category)
        const related = mockBooks
          .filter((b) => b.category_id === foundBook.category_id && b.id !== foundBook.id)
          .slice(0, 4)
        setRelatedBooks(related)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= (book?.available_quantity || 0)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (book && book.available_quantity > 0) {
      addToCart(book, quantity)
      setAddedToCart(true)

      // Reset added to cart status after 3 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Đang tải thông tin sách...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Có lỗi xảy ra</h2>
        <p>{error}</p>
        <Link to="/" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.bookDetailsPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to={`/search?category=${category?.id}`}>{category?.name}</Link>
          <span>/</span>
          <span>{book.title}</span>
        </div>

        <div className={styles.bookDetails}>
          <div className={styles.bookImageContainer}>
            <img
              src={book.cover_image || "/placeholder.svg?height=500&width=350"}
              alt={book.title}
              className={styles.bookImage}
            />
          </div>

          <div className={styles.bookInfo}>
            <h1 className={styles.bookTitle}>{book.title}</h1>

            <div className={styles.bookMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tác giả:</span>
                <Link to={`/search?author=${author?.id}`} className={styles.metaValue}>
                  {book.author}
                </Link>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Thể loại:</span>
                <Link to={`/search?category=${category?.id}`} className={styles.metaValue}>
                  {category?.name}
                </Link>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Nhà xuất bản:</span>
                <span className={styles.metaValue}>{book.publisher}</span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Năm xuất bản:</span>
                <span className={styles.metaValue}>{book.publish_year}</span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Số trang:</span>
                <span className={styles.metaValue}>{book.pages}</span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Ngôn ngữ:</span>
                <span className={styles.metaValue}>{book.language}</span>
              </div>
            </div>

            <div className={styles.bookPricing}>
              <div className={styles.rentalPrice}>
                <span className={styles.priceLabel}>Giá thuê:</span>
                <span className={styles.priceValue}>{book.rental_price.toLocaleString("vi-VN")}đ</span>
                <span className={styles.pricePeriod}>/tuần</span>
              </div>

              <div className={styles.depositPrice}>
                <span className={styles.priceLabel}>Đặt cọc:</span>
                <span className={styles.depositValue}>{book.deposit_price.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <div className={styles.bookAvailability}>
              <span className={styles.availabilityLabel}>Tình trạng:</span>
              {book.available_quantity > 0 ? (
                <span className={styles.inStock}>Còn sách ({book.available_quantity})</span>
              ) : (
                <span className={styles.outOfStock}>Hết sách</span>
              )}
            </div>

            {book.available_quantity > 0 && (
              <div className={styles.addToCartSection}>
                <div className={styles.quantityControl}>
                  <button className={styles.quantityButton} onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={book.available_quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => quantity < book.available_quantity && setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className={`${styles.addToCartButton} ${addedToCart ? styles.added : ""}`}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check size={18} />
                      <span>Đã thêm vào giỏ</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Thêm vào giỏ</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className={styles.bookActions}>
              <button className={styles.actionButton}>
                <Heart size={18} />
                <span>Yêu thích</span>
              </button>
              <button className={styles.actionButton}>
                <Share2 size={18} />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bookDescription}>
          <h2 className={styles.sectionTitle}>Giới thiệu sách</h2>
          <div className={styles.descriptionContent}>
            <p>{book.description}</p>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className={styles.relatedBooks}>
            <h2 className={styles.sectionTitle}>Sách cùng thể loại</h2>
            <div className={styles.relatedBooksGrid}>
              {relatedBooks.map((relatedBook) => (
                <div key={relatedBook.id} className={styles.relatedBookCard}>
                  <Link to={`/books/${relatedBook.id}`} className={styles.relatedBookLink}>
                    <img
                      src={relatedBook.cover_image || "/placeholder.svg?height=300&width=200"}
                      alt={relatedBook.title}
                      className={styles.relatedBookImage}
                    />
                    <div className={styles.relatedBookInfo}>
                      <h3 className={styles.relatedBookTitle}>{relatedBook.title}</h3>
                      <p className={styles.relatedBookAuthor}>{relatedBook.author}</p>
                      <p className={styles.relatedBookPrice}>
                        {relatedBook.rental_price.toLocaleString("vi-VN")}đ/tuần
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetailsPage
