"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, BookOpen, Clock, Award, Users } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import { mockBooks, mockCategories } from "../../../mockData"

// Styles moved to a CSS module file
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading
    const fetchData = async () => {
      try {
        // Simulate network delay
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className={styles.homePage}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Thế Giới Sách Trong Tầm Tay</h1>
          <p>Khám phá, học hỏi và thư giãn với hàng ngàn đầu sách chất lượng</p>
          <div className={styles.heroActions}>
            <Link to="/books" className={styles.primaryButton}>
              Khám Phá Ngay
            </Link>
            <Link to="/how-it-works" className={styles.secondaryButton}>
              Hướng Dẫn
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* Hero image will be set in CSS */}
        </div>
      </section>

      {/* Featured Books */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>Sách Nổi Bật</h2>
            <Link to="/search?featured=true" className={styles.viewAll}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>Danh Mục Phổ Biến</h2>
            <Link to="/categories" className={styles.viewAll}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.categoriesGrid}>
            {popularCategories.map((category) => (
              <Link key={category.id} to={`/search?category=${category.id}`} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.bookCount} sách</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2>Tại Sao Chọn BookRental?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrapper}>
                <BookOpen size={28} />
              </div>
              <h3>Đa Dạng Sách</h3>
              <p>
                Hơn 10.000 đầu sách đa dạng thể loại, từ văn học đến sách chuyên ngành
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrapper}>
                <Clock size={28} />
              </div>
              <h3>Tiết Kiệm Thời Gian</h3>
              <p>
                Đặt sách trực tuyến và nhận sách tại nhà hoặc tại thư viện một cách nhanh chóng
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrapper}>
                <Award size={28} />
              </div>
              <h3>Chất Lượng Đảm Bảo</h3>
              <p>
                Sách được bảo quản cẩn thận, kiểm tra kỹ lưỡng trước khi đến tay bạn
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrapper}>
                <Users size={28} />
              </div>
              <h3>Cộng Đồng Sách</h3>
              <p>
                Tham gia cộng đồng yêu sách, chia sẻ đánh giá và khám phá sách mới
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>Sách Mới</h2>
            <Link to="/search?sort=newest" className={styles.viewAll}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.booksCarousel}>
            {newArrivals.map((book) => (
              <div key={book.id} className={styles.carouselItem}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Books */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>Gợi Ý Cho Bạn</h2>
            <Link to="/search?recommended=true" className={styles.viewAll}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.booksCarousel}>
            {recommendedBooks.map((book) => (
              <div key={book.id} className={styles.carouselItem}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorksSection}>
        <div className={styles.container}>
          <h2>Cách Thức Hoạt Động</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Tìm Sách</h3>
              <p>Tìm kiếm và lựa chọn sách từ thư viện đa dạng của chúng tôi</p>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Đặt Thuê</h3>
              <p>Thêm sách vào giỏ hàng và tiến hành đặt thuê</p>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Nhận Sách</h3>
              <p>Nhận sách tại thư viện hoặc giao hàng tận nơi</p>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Trả Sách</h3>
              <p>Trả sách khi hết thời hạn hoặc gia hạn thêm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2>Đăng Ký Nhận Tin</h2>
            <p>Nhận thông tin về sách mới và ưu đãi đặc biệt</p>
            <form className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Nhập địa chỉ email của bạn" 
                  required 
                />
                <button type="submit">Đăng Ký</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage