import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart, Info } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import { useToast } from "../../../contexts/ToastContext"
// import { mockImages } from "../../../mockData"
import styles from "./BookCard.module.css"

const BookCard = ({ book, showBookDetail = true, releaseYear, smaller = false}) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [addedToCart, setAddedToCart] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const [detailPosition, setDetailPosition] = useState("center")
  const cardRef = useRef(null)
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

  // xử lý khi ấn vào nút thích
  const handleAddToFavorite = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    showToast({
      type: "info",
      message: `Đã thêm "${book.title}" vào danh sách yêu thích`,
    })
  }

  // xử lý hiển thị book detail khi hover vào card
  useEffect(() => {
    if (isHovered && cardRef.current) {
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
  }, [isHovered])

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    const timeout = setTimeout(() => {
      setIsHovered(true)
    }, 200)
    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setTimeout(() => {
      const cardElement = cardRef.current
      const detailElement = document.querySelector(`.${styles.bookDetail}`)
      if (cardElement && detailElement) {
        const isHoveringCard = cardElement.matches(':hover')
        const isHoveringDetail = detailElement.matches(':hover')
        if (!isHoveringCard && !isHoveringDetail) {
          setIsHovered(false)
        }
      } else {
        setIsHovered(false)
      }
    }, 50)
  }

  const getDetailStyle = () => {
    let transformValue = "translate(-50%, -50%)";
    if (detailPosition === "left") {
      transformValue = "translate(-90%, -50%)";
    } else if (detailPosition === "right") {
      transformValue = "translate(-10%, -50%)";
    }
    return {
      opacity: isHovered ? 1 : 0,
      transform: `${transformValue} scale(${isHovered ? 1 : 0.95})`,
      visibility: isHovered ? "visible" : "hidden",
      transition: isHovered 
        ? "opacity 0.25s ease-in-out, transform 0.25s ease-in-out" 
        : "opacity 0.25s ease-in-out, transform 0.25s ease-in-out, visibility 0s linear 0.25s",
      willChange: 'transform, opacity'
    }
  }

  return (
    <div className={smaller ? styles.bookCardSmaller : styles.bookCard} ref={cardRef}>
      <Link to={`/books/${book?.id}`} className={styles.bookLink}>
        <div 
          className={styles.imageContain}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {releaseYear && (
              <p className={styles.releaseYear}>{releaseYear}</p>
            )}
          <img src="/auth.jpg" alt="book" className={styles.bookImg} />
        </div>
      </Link>
      
      <div className={styles.bookInfo}>
        <Link to={`/books/${book?.id}`} className={styles.bookLink}>
          <p className={styles.bookTitle} style={smaller === true ? {fontSize: "16px"} : {}}>Sự thật chỉ có một nhưng có nhiều lựa chọn</p>
        </Link>
        
        <Link to={'/authors/thaitruong'}>
          <p className={styles.bookAuthor}>Thái Văn Trường</p>
        </Link>
        
        <div className={styles.bookPrice}>
          <span className={styles.normalPrice}>{book?.rental_price.toLocaleString("vi-VN")}đ</span>
          <span className={styles.rentalPeriod}>/tuần</span>
        </div>
      </div>

      {/* Book Detail */}
      {showBookDetail && (
        <div 
          className={styles.bookDetail}
          style={getDetailStyle()}
          onMouseEnter={() => {
            if (hoverTimeout) {
              clearTimeout(hoverTimeout)
              setHoverTimeout(null)
            }
            setIsHovered(true)
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.deltaiImgContainer}>
            <img src="auth.jpg" alt="" className={styles.deltailImg} />
          </div>
          
          <div className={styles.detailInfor}>
            <div className={styles.basicInfor}>
              <p className={styles.bookTitleDetail}>Sự thật chỉ có một</p>
              <p className={styles.bookAuthorDetail}>Tác giả: Thái Văn Trường</p>
              <p className={styles.bookCategory}>Thể loại: Kinh tế</p>
              <p className={styles.bookPrice}>Giá thuê: 200.000đ/tuần</p>
            </div>
            
            <div className={styles.bookFunc}>
              <p 
                className={styles.addToCardBtn} 
                onClick={handleAddToCart}
              >
                <ShoppingCart /> Thêm vào giỏ
              </p>
              
              <p className={styles.addToFavoriteBtn}
                onClick={handleAddToFavorite}
              >
                <Heart /> Thích
              </p>
              
              <p className={styles.viewMoreBtn}
                onClick={()=> navigate(`/books/${book?.id}`)}>
                <Info /> Xem thêm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCard