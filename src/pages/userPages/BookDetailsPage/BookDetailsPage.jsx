"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ShoppingCart, Heart, Share2, ArrowLeft, Check, Star, Mail, Calendar, Clock, AlertCircle, X } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import { useToast } from "../../../contexts/ToastContext"
import { useAuth } from "../../../contexts/AuthContext"
import { mockBooks, mockCategories, mockAuthors, mockImages, mockUsers, mockRentalOrders, mockRentalItems } from "../../../mockData"
import styles from "./BookDetailsPage.module.css"

const BookDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast() || {}
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState(null)
  const [author, setAuthor] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [addedToCart, setAddedToCart] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState(false)
  const [bookImages, setBookImages] = useState([])
  const [activeImage, setActiveImage] = useState(null)
  const [userRentalHistory, setUserRentalHistory] = useState([])
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  
  // Lấy an toàn từ context, đảm bảo không gây lỗi nếu context chưa sẵn sàng
  const cart = useCart() || {}
  const { addToCart } = cart

  useEffect(() => {
    // Reset state when id changes
    setBook(null)
    setLoading(true)
    setError(null)
    setQuantity(1)
    setAddedToCart(false)
    setAddedToWishlist(false)
    setBookImages([])
    setActiveImage(null)

    // In a real app, this would be an API call
    const fetchBook = () => {
      try {
        const foundBook = mockBooks.find((book) => book.id === Number.parseInt(id))

        if (!foundBook) {
          throw new Error("Không tìm thấy sách")
        }

        setBook(foundBook)

        // Get all book images from images table
        const images = mockImages.filter((img) => img.product_id === foundBook.id);
        setBookImages(images);
        
        // Set cover image as active image
        const coverImage = images.find(img => img.is_cover);
        setActiveImage(coverImage ? coverImage.url : "/placeholder.svg?height=500&width=350");

        // Get category
        const foundCategory = mockCategories.find((cat) => cat.id === foundBook.category_id)
        setCategory(foundCategory)

        // Get author
        const foundAuthor = mockAuthors.find((auth) => auth.id === foundBook.author_id)
        setAuthor(foundAuthor)

        // Get related books (same category)
        const related = mockBooks
          .filter((b) => b.category_id === foundBook.category_id && b.id !== foundBook.id)
          .slice(0, 4)
        setRelatedBooks(related)
        
        // Get user's rental history for this book (if logged in)
        if (user) {
          // Find user's orders
          const userOrders = mockRentalOrders.filter(order => order.user_id === user.id);
          // Find orders that contain this book
          const bookRentalHistory = userOrders.map(order => {
            const items = mockRentalItems.filter(
              item => item.order_id === order.id && item.product_detail_id === foundBook.id
            );
            return {
              ...order,
              items
            };
          }).filter(order => order.items.length > 0);
          
          setUserRentalHistory(bookRentalHistory);
        }
        
        // Get recommended books based on user's age, gender, and interests
        if (user) {
          // In real implementation, this would use the trains table to provide recommendations
          // For now, we'll mock recommendations based on the same author or category
          const recommendations = mockBooks
            .filter(b => 
              (b.author_id === foundBook.author_id || b.category_id === foundBook.category_id) && 
              b.id !== foundBook.id
            )
            .slice(0, 4);
          setRecommendedBooks(recommendations);
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, user])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= (book?.stock || 0)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (book && book.stock > 0 && addToCart) {
      addToCart(book, quantity)
      setAddedToCart(true)
      if (showToast) {
        showToast({ type: "success", message: "Đã thêm sách vào giỏ hàng!" })
      }

      // Reset added to cart status after 3 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    }
  }
  
  const handleAddToWishlist = () => {
    // In a real app, this would make an API call to add the book to the user's wishlist
    setAddedToWishlist(!addedToWishlist);
    
    if (showToast) {
      if (!addedToWishlist) {
        showToast({ type: "success", message: "Đã thêm sách vào danh sách yêu thích!" })
      } else {
        showToast({ type: "info", message: "Đã xóa sách khỏi danh sách yêu thích!" })
      }
    }
  }
  
  const handleSubscribeForNotification = (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // In a real app, this would make an API call to add the subscription
    // This would use the subscribes table
    setTimeout(() => {
      setIsSubscribing(false);
      setShowNotificationForm(false);
      if (showToast) {
        showToast({ 
          type: "success", 
          message: "Đăng ký thành công! Chúng tôi sẽ thông báo khi sách có hàng." 
        });
      }
    }, 1000);
  }

  // Function to get cover image for related books
  const getBookCoverImage = (bookId) => {
    const coverImage = mockImages.find((img) => img.product_id === bookId && img.is_cover)
    return coverImage ? coverImage.url : "/placeholder.svg?height=300&width=200"
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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
          <div className={styles.bookImagesSection}>
            <div className={styles.bookImageContainer}>
              <img src={activeImage || "/placeholder.svg"} alt={book.title} className={styles.bookImage} />
            </div>
            
            {bookImages.length > 1 && (
              <div className={styles.thumbnailGallery}>
                {bookImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`${styles.thumbnail} ${activeImage === image.url ? styles.activeThumbnail : ''}`}
                    onClick={() => setActiveImage(image.url)}
                  >
                    <img src={image.url} alt={`${book.title} - Ảnh ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.bookInfo}>
            <h1 className={styles.bookTitle}>{book.title}</h1>

            <div className={styles.bookMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tác giả:</span>
                <Link to={`/search?author=${author?.id}`} className={styles.metaValue}>
                  {author?.name || "Không xác định"}
                </Link>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Thể loại:</span>
                <Link to={`/search?category=${category?.id}`} className={styles.metaValue}>
                  {category?.name || "Không xác định"}
                </Link>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Nhà xuất bản:</span>
                <span className={styles.metaValue}>{book.publisher}</span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Năm xuất bản:</span>
                <span className={styles.metaValue}>{new Date(book.publish_date).getFullYear()}</span>
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
              {book.stock > 0 ? (
                <span className={styles.inStock}>Còn sách ({book.stock})</span>
              ) : (
                <span className={styles.outOfStock}>Hết sách</span>
              )}
            </div>

            {book.stock > 0 ? (
              <div className={styles.addToCartSection}>
                <div className={styles.quantityControl}>
                  <button className={styles.quantityButton} onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={book.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => quantity < book.stock && setQuantity(quantity + 1)}
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
            ) : (
              <div className={styles.notifySection}>
                <button 
                  className={styles.notifyButton}
                  onClick={() => setShowNotificationForm(!showNotificationForm)}
                >
                  <Mail size={18} />
                  <span>Thông báo khi có sách</span>
                </button>
                
                {showNotificationForm && (
                  <form className={styles.notifyForm} onSubmit={handleSubscribeForNotification}>
                    <div className={styles.formHeader}>
                      <h3>Đăng ký nhận thông báo khi có sách</h3>
                      <button type="button" className={styles.closeButton} onClick={() => setShowNotificationForm(false)}>
                        <X size={16} />
                      </button>
                    </div>
                    <p>Chúng tôi sẽ gửi email thông báo khi sách này có hàng trở lại.</p>
                    <div className={styles.formField}>
                      <label htmlFor="notification-email">Email:</label>
                      <input 
                        type="email" 
                        id="notification-email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        required
                      />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={isSubscribing}>
                      {isSubscribing ? "Đang đăng ký..." : "Đăng ký nhận thông báo"}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className={styles.bookActions}>
              <button 
                className={`${styles.actionButton} ${addedToWishlist ? styles.active : ''}`}
                onClick={handleAddToWishlist}
              >
                <Heart size={18} />
                <span>{addedToWishlist ? "Đã yêu thích" : "Yêu thích"}</span>
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
        
        {userRentalHistory.length > 0 && (
          <div className={styles.rentalHistory}>
            <h2 className={styles.sectionTitle}>Lịch sử thuê sách của bạn</h2>
            <div className={styles.historyList}>
              {userRentalHistory.map(order => (
                <div key={order.id} className={styles.historyItem}>
                  <div className={styles.historyHeader}>
                    <div className={styles.historyOrder}>
                      <span className={styles.orderLabel}>Mã đơn hàng:</span>
                      <span className={styles.orderValue}>#{order.id}</span>
                    </div>
                    <div className={styles.historyDate}>
                      <Calendar size={16} />
                      <span>Ngày thuê: {formatDate(order.rental_date)}</span>
                    </div>
                    <div className={styles.historyStatus}>
                      <span className={`${styles.statusBadge} ${styles[`status${order.order_status}`]}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.historyDetails}>
                    <div className={styles.historyDetail}>
                      <Clock size={16} />
                      <span>Hạn trả: {formatDate(order.due_date)}</span>
                    </div>
                    {order.return_date && (
                      <div className={styles.historyDetail}>
                        <Check size={16} />
                        <span>Đã trả: {formatDate(order.return_date)}</span>
                      </div>
                    )}
                    {order.late_fee > 0 && (
                      <div className={styles.historyDetail}>
                        <AlertCircle size={16} />
                        <span>Phí trễ hạn: {order.late_fee.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedBooks.length > 0 && (
          <div className={styles.relatedBooks}>
            <h2 className={styles.sectionTitle}>Sách cùng thể loại</h2>
            <div className={styles.relatedBooksGrid}>
              {relatedBooks.map((relatedBook) => (
                <div key={relatedBook.id} className={styles.relatedBookCard}>
                  <Link to={`/books/${relatedBook.id}`} className={styles.relatedBookLink}>
                    <img
                      src={getBookCoverImage(relatedBook.id) || "/placeholder.svg"}
                      alt={relatedBook.title}
                      className={styles.relatedBookImage}
                    />
                    <div className={styles.relatedBookInfo}>
                      <h3 className={styles.relatedBookTitle}>{relatedBook.title}</h3>
                      <p className={styles.relatedBookAuthor}>
                        {mockAuthors.find((author) => author.id === relatedBook.author_id)?.name || "Không xác định"}
                      </p>
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
        
        {recommendedBooks.length > 0 && (
          <div className={styles.recommendedBooks}>
            <h2 className={styles.sectionTitle}>Đề xuất dành cho bạn</h2>
            <div className={styles.relatedBooksGrid}>
              {recommendedBooks.map((recommendedBook) => (
                <div key={recommendedBook.id} className={styles.relatedBookCard}>
                  <Link to={`/books/${recommendedBook.id}`} className={styles.relatedBookLink}>
                    <img
                      src={getBookCoverImage(recommendedBook.id) || "/placeholder.svg"}
                      alt={recommendedBook.title}
                      className={styles.relatedBookImage}
                    />
                    <div className={styles.relatedBookInfo}>
                      <h3 className={styles.relatedBookTitle}>{recommendedBook.title}</h3>
                      <p className={styles.relatedBookAuthor}>
                        {mockAuthors.find((author) => author.id === recommendedBook.author_id)?.name || "Không xác định"}
                      </p>
                      <p className={styles.relatedBookPrice}>
                        {recommendedBook.rental_price.toLocaleString("vi-VN")}đ/tuần
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
