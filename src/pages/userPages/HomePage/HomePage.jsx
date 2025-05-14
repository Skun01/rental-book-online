import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ArrowRight, BookOpen, Clock, Award, Users, Send } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import BookCardOrder from "../../../components/userComponents/bookCardOrder/BookCardOrder"
import { mockBooks, mockCategories } from "../../../mockData"
import BookSlider from "./BookSlider"
import ViewMoreBtn from "../../../components/userComponents/viewMorebtn/ViewMoreBtn"
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Lấy dữ liệu từ API backend
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setFeaturedBooks(mockBooks.slice(0, 4))
        setNewArrivals(mockBooks.slice(4, 10))
        setPopularCategories(mockCategories.slice(0, 6))
        setRecommendedBooks(mockBooks.slice(10, 16))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // xử lý submit email khi người dùng đăng ký
  const handleSubmit = (e) => {
    e.preventDefault()
    setEmail("")
    alert("Đăng ký nhận thông báo thành công!")
  }


  // giao diện loading để hiển thị khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }
  return (
    <div className={styles.homePage}>

      {/* bookslider để làm đẹp thôi :) */}
      <BookSlider />

      {/* Các sách nổi bật */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Các sách nổi bật</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <BookCard book={book} showBookDetail = {false} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bạn đang muốn sách gì?</h2>
            <Link to="/search" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.categoriesGrid}>
            {popularCategories.map((category) => (
              <Link key={category.id} to={`/search?category=${category.id}`} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryCount}>{category.bookCount} sách</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top 5 sách bán chạy */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top 5 sách bán chạy</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {newArrivals.slice(0, 5).map((book, index) => (
              <BookCardOrder book={book} orderNumber={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Các sách mới */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sách mới</h2>
            <Link to="/search?sort=newest" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksRow}>
            {newArrivals.slice(0, 4).map((book) => (
              <div key={book.id} className={styles.bookItemSmall}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Gợi ý cho bạn</h2>
            <Link to="/search?recommended=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksRow}>
            {recommendedBooks.slice(0, 4).map((book) => (
              <div key={book.id} className={styles.bookItemSmall}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Nhận thông báo về sách mới</h2>
            <p className={styles.ctaText}>Nhập email để nhận thông báo về sách mới, khuyến mãi và các sự kiện</p>
            <form onSubmit={handleSubmit} className={styles.ctaForm}>
              <input 
                type="email" 
                className={styles.ctaInput} 
                placeholder="Nhập địa chỉ email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.ctaButton}>
                Đăng ký ngay <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage