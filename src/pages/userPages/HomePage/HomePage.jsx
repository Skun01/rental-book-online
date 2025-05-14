import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ArrowRight, BookOpen, Clock, Award, Users, Send } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import BookCardOrder from "../../../components/userComponents/bookCardOrder/BookCardOrder"
import CategoryCard from "../../../components/userComponents/categoryCard/CategoryCard" 
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

  // tự động scoll lên đầu trang khi dữ liệu đã được tải xong
  useEffect(() => {
  if (!isLoading) {
    window.scrollTo({ top: 0, behavior: "smooth" }) // hoặc "auto"
  }
}, [isLoading]) 
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

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bạn đang quan tâm chủ đề gì?</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {popularCategories.slice(0, 5).map((category, index) => (
              <Link key={category.id} to={`/search?category=${category.id}`}>
                <CategoryCard categoryName={category.name} categoryOrder={index} />
              </Link>
            ))}
            {popularCategories.length > 5 && (
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <div className={styles.categoriesMore}>
                + {popularCategories.length - 5} chủ đề khác
              </div>
            </Link>
          )}
          </div>
          
        </div>
      </section>

      {/* Mới phát hành */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mới phát hành</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <BookCard book={book} showBookDetail = {false} releaseYear={2025}/>
            ))}
          </div>
        </div>
      </section>

      {/* Top 5 sách bán chạy */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top 5 được thuê nhiều nhất</h2>
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

      {/* Sách tuổi trẻ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dành cho tuổi teen</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <BookCard book={book}/>
            ))}
          </div>
        </div>
      </section>

      {/* Mới phát hành */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Gợi ý cho bạn</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              <ViewMoreBtn text="Xem tất cả" />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <BookCard book={book}/>
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