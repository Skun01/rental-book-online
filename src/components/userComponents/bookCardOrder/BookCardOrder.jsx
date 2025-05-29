import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Info } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import { useToast } from "../../../contexts/ToastContext"
import styles from "./BookCardOrder.module.css"

const BookCardOrder = ({ book, showBookDetail = true, orderNumber }) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [addedToCart, setAddedToCart] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailPosition, setDetailPosition] = useState("center")
  const cardRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const navigate = useNavigate();
  
  // xử lý khi ấn nút thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!addedToCart && book.stock > 0) {
      addToCart(book)
      setAddedToCart(true)
      showToast({
        type: "success",
        message: `Đã thêm "${book.title}" vào giỏ hàng`,
      })
      setTimeout(() => {
        setAddedToCart(false)
      }, 1000)
    }
  }

  // xử lý hiển thị book detail khi hover vào card
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

  return (
    <div className={styles.bookCard} ref={cardRef}>
      <Link to={`/books/${book?.id}`} className={styles.bookLink}>
        <div 
          className={styles.imageContain}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={book.imageList && book.imageList[0] && book.imageList[0]["url"] ? book.imageList[0]["url"] : "/auth.jpg"} 
            alt="book" 
            className={styles.bookImg} 
          />
        </div>
      </Link>
      
      <div className={styles.bookInfoContainer}>
        <div className={styles.bookInfoTop}>
          <p className={styles.bookOrderNumber}>{orderNumber}</p>
        </div>
        <div className={styles.bookInfo}>
          <Link to={`/books/${book?.id}`} className={styles.bookLink}>
            <p className={styles.bookTitle}>{book.name}</p>
          </Link>
        
          <Link to={`/authors/${book.author?.id}`}>
            <p className={styles.bookAuthor}>{book.author?.name}</p>
          </Link>
        
          <div className={styles.bookPrice}>
            <span className={styles.normalPrice}>
              {book.depositPrice ? book.rentalPrice.toLocaleString("vi-VN") : '0'}đ
            </span>
            <span className={styles.rentalPeriod}>/tuần</span>
          </div>
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
              src={book.imageList && book.imageList[0] && book.imageList[0]["url"] ? book.imageList[0]["url"] : "/auth.jpg"} 
              alt="" 
              className={styles.deltailImg} 
            />
          </div>
          
          <div className={styles.detailInfor}>
            <div className={styles.basicInfor}>
              <p className={styles.bookTitleDetail}>{book.name}</p>
              <p className={styles.bookAuthorDetail}>Tác giả: {book.author?.name}</p>
              <p className={styles.bookCategory}>Thể loại: {book.category?.name}</p>
              <p className={styles.bookCategory}>
                Tiền đặt cọc: {book.depositPrice ? book.depositPrice.toLocaleString('vi-VN') : '0'}đ
              </p>
              <p className={styles.bookPrice} style={{color: '#2563eb'}}>
                Giá thuê: {book.depositPrice ? `${book.rentalPrice.toLocaleString('vi-VN')}đ/Tuần` : '0đ/Tuần'}
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

export default BookCardOrder;