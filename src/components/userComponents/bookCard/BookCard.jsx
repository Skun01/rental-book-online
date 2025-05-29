import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart, Info } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import styles from "./BookCard.module.css"

const BookCard = ({ book, showBookDetail = true, releaseYear, smaller = false}) => {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailPosition, setDetailPosition] = useState("center")
  const cardRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const navigate = useNavigate();
  
  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    addToCart(book, 7, 1)
  }

  // Xử lý vị trí hiển thị book detail
  useEffect(() => {
    if (showDetail && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      const windowWidth = window.innerWidth
      if (cardRect.left < 270) {
        setDetailPosition("right")
      } 
      else if (windowWidth - cardRect.right < 270) {
        setDetailPosition("left")
      } 
      else {
        setDetailPosition("center")
      }
    }
  }, [showDetail])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDetail(true)
    }, 1000)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    if (!showDetail) {
      return
    }
  }

  const handleDetailMouseEnter = () => {
    setIsHovered(true)
  }

  const handleDetailMouseLeave = () => {
    setIsHovered(false)
    setShowDetail(false)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const getDetailStyle = () => {
    let transformValue = "translate(-50%, -50%)";
    if (detailPosition === "left") {
      transformValue = "translate(-90%, -50%)";
    } else if (detailPosition === "right") {
      transformValue = "translate(-10%, -50%)";
    }
    return {
      opacity: showDetail ? 1 : 0,
      transform: transformValue,
      visibility: showDetail ? "visible" : "hidden"
    }
  }

  // Format giá tiền theo chuẩn Việt Nam
  const formatPrice = (price) => {
    return price ? price.toLocaleString('vi-VN') : '0'
  }

  // Tính toán ngày phát hành nếu có
  const getPublishYear = () => {
    if (releaseYear) return releaseYear
    if (book.publish_date) {
      return new Date(book.publish_date).getFullYear()
    }
    return null
  }

  return (
    <div className={smaller ? styles.bookCardSmaller : styles.bookCard} ref={cardRef}>
      <Link to={`/books/${book?.id}`} className={styles.bookLink}>
        <div 
          className={styles.imageContain}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {getPublishYear() && (
            <p className={styles.releaseYear}>{getPublishYear()}</p>
          )}
          <img 
            src={
              book.imageList && book.imageList.length > 0 && book.imageList[0].url 
                ? book.imageList[0].url 
                : "/auth.jpg"
            } 
            alt={book.name || "Book cover"} 
            className={styles.bookImg} 
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className={styles.bookInfo}>
        <Link to={`/books/${book?.id}`} className={styles.bookLink}>
          <p 
            className={styles.bookTitle} 
            style={smaller ? {fontSize: "16px"} : {}}
            title={book.name}
          >
            {book.name || 'Đang cập nhật'}
          </p>
        </Link>
        
        <Link to={`/authors/${book.author?.id}`}>
          <p 
            className={styles.bookAuthor}
            title={book.author?.name}
          >
            {book.author?.name || 'Đang cập nhật'}
          </p>
        </Link>
        
        <div className={styles.bookPrice}>
          <span className={styles.normalPrice}>
            {formatPrice(book.rentalPrice)}đ
          </span>
          <span className={styles.rentalPeriod}>/Tuần</span>
        </div>
      </div>

      {/* Book Detail */}
      {showBookDetail && (
        <div 
          className={styles.bookDetail}
          style={getDetailStyle()}
          onMouseEnter={handleDetailMouseEnter}
          onMouseLeave={handleDetailMouseLeave}
        >
          <div className={styles.deltaiImgContainer}>
            <img 
              src={
                book.imageList && book.imageList.length > 0 && book.imageList[0].url 
                  ? book.imageList[0].url 
                  : "/auth.jpg"
              } 
              alt={book.name || "Book detail"} 
              className={styles.deltailImg} 
            />
          </div>
          
          <div className={styles.detailInfor}>
            <div className={styles.basicInfor}>
              <p className={styles.bookTitleDetail}>{book.name || 'Đang cập nhật'}</p>
              <p className={styles.bookAuthorDetail}>
                Tác giả: {book.author?.name || 'Đang cập nhật'}
              </p>
              <p className={styles.bookCategory}>
                Thể loại: {book.category?.name || 'Đang cập nhật'}
              </p>
              {book.stock !== undefined && (
                <p className={styles.bookCategory}>
                  Còn lại: {book.stock} quyển
                </p>
              )}
              <p className={styles.bookCategory}>
                Tiền đặt cọc: {formatPrice(book.depositPrice)}đ/quyển
              </p>
              <p className={styles.bookPrice} style={{color: '#2563eb'}}>
                Giá thuê: {formatPrice(book.rentalPrice)}đ/tuần
              </p>
            </div>
            
            <div className={styles.bookFunc}>
              <p 
                className={styles.addToCardBtn} 
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Thêm vào giỏ
              </p>
              
              <p 
                className={styles.viewMoreBtn}
                onClick={() => navigate(`/books/${book?.id}`)}
              >
                <Info size={18} /> Xem thêm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCard