"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ArrowRight, BookOpen, Clock, Award, Users } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import { mockBooks, mockCategories } from "../../../mockData"
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true)

    // In a real app, these would be API calls
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
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}

      {/* Featured Books */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sách nổi bật</h2>
            <Link to="/search?featured=true" className={styles.viewAllLink}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.booksGrid}>
            {featuredBooks.map((book) => (
              <div key={book.id} className={styles.bookItem}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Danh mục phổ biến</h2>
            <Link to="/search" className={styles.viewAllLink}>
              Xem tất cả <ChevronRight size={16} />
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

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.benefitsTitle}>Tại sao chọn BookRental?</h2>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <BookOpen size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Đa dạng sách</h3>
              <p className={styles.benefitText}>
                Hơn 10.000 đầu sách thuộc nhiều thể loại khác nhau, từ sách văn học đến sách chuyên ngành.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Clock size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Tiết kiệm thời gian</h3>
              <p className={styles.benefitText}>
                Đặt sách trực tuyến và nhận sách tại nhà hoặc tại thư viện của chúng tôi một cách nhanh chóng.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Award size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Chất lượng đảm bảo</h3>
              <p className={styles.benefitText}>
                Sách được bảo quản cẩn thận, kiểm tra kỹ lưỡng trước khi đến tay bạn.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Users size={32} />
              </div>
              <h3 className={styles.benefitTitle}>Cộng đồng đọc sách</h3>
              <p className={styles.benefitText}>Tham gia cộng đồng yêu sách, chia sẻ đánh giá và khám phá sách mới.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sách mới</h2>
            <Link to="/search?sort=newest" className={styles.viewAllLink}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.booksRow}>
            {newArrivals.map((book) => (
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
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.booksRow}>
            {recommendedBooks.map((book) => (
              <div key={book.id} className={styles.bookItemSmall}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cách thức hoạt động</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Tìm sách</h3>
              <p className={styles.stepDescription}>Tìm kiếm và lựa chọn sách từ thư viện đa dạng của chúng tôi</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Đặt thuê</h3>
              <p className={styles.stepDescription}>Thêm sách vào giỏ hàng và tiến hành đặt thuê</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Nhận sách</h3>
              <p className={styles.stepDescription}>Nhận sách tại thư viện hoặc giao hàng tận nơi</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Trả sách</h3>
              <p className={styles.stepDescription}>Trả sách khi hết thời hạn hoặc gia hạn thêm</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Bắt đầu hành trình đọc sách ngay hôm nay</h2>
            <p className={styles.ctaText}>Đăng ký tài khoản để trải nghiệm dịch vụ cho thuê sách của chúng tôi</p>
            <Link to="/register" className={styles.ctaButton}>
              Đăng ký ngay <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
