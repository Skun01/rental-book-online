import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sampleBooks, sampleCategories, sampleRecommendations } from "../../sampleData";
import BookCard from "../../components/userComponents/bookCard/BookCard";
import { BookOpen, ShoppingCart, Undo2 } from "lucide-react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const featured = sampleBooks.filter((book) => book.available_quantity > 5).slice(0, 4);
      const arrivals = [...sampleBooks]
        .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
        .slice(0, 4);
      const categories = sampleCategories.slice(0, 6);

      const recs = sampleRecommendations.map((rec) => ({
        ...rec,
        book: sampleBooks.find((book) => book.id === rec.book_id) || rec.book,
      }));

      setFeaturedBooks(featured);
      setNewArrivals(arrivals);
      setPopularCategories(categories);
      setRecommendations(recs);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải sách...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1>Khám Phá Những Cuốn Sách Tuyệt Vời</h1>
          <p>Thuê sách dễ dàng và tiết kiệm. Không lo phí trễ hạn, chỉ có sách hay.</p>
          <Link to="/books" className={styles.browseButton}>
            Xem Bộ Sưu Tập
          </Link>
        </div>
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className={styles.bookSection}>
          <div className={styles.sectionHeader}>
            <h2>Gợi ý dành cho bạn</h2>
            <Link to="/books?recommended=true" className={styles.viewAll}>
              Xem tất cả
            </Link>
          </div>
          <div className={styles.bookGrid}>
            {recommendations.map((rec) => (
              <BookCard key={rec.id} book={rec.book} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Books */}
      <section className={styles.bookSection}>
        <div className={styles.sectionHeader}>
          <h2>Sách Nổi Bật</h2>
          <Link to="/books?featured=true" className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
        <div className={styles.bookGrid}>
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2>Danh Mục Sách</h2>
          <Link to="/books" className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
        <div className={styles.categoriesGrid}>
          {popularCategories.map((category) => (
            <Link
              to={`/books?category=${category.id}`}
              key={category.id}
              className={styles.categoryCard}
            >
              <div className={styles.categoryIcon}>{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.bookCount} sách</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.bookSection}>
        <div className={styles.sectionHeader}>
          <h2>Sách Mới</h2>
          <Link to="/books?sort=newest" className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
        <div className={styles.bookGrid}>
          {newArrivals.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>Cách Thức Thuê Sách</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <BookOpen size={24} />
            </div>
            <h3>1. Chọn Sách</h3>
            <p>Khám phá bộ sưu tập và thêm sách yêu thích vào giỏ hàng.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <ShoppingCart size={24} />
            </div>
            <h3>2. Thanh Toán & Nhận Sách</h3>
            <p>Thanh toán phí thuê và đặt cọc, sau đó nhận sách tận tay.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <Undo2 size={24} />
            </div>
            <h3>3. Đọc & Trả Sách</h3>
            <p>Thưởng thức sách và trả lại khi xong để hoàn tiền đặt cọc.</p>
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <section className={styles.subscriptionBanner}>
        <div className={styles.subscriptionContent}>
          <h2>Đăng Ký Nhận Tin</h2>
          <p>Nhận cập nhật sách mới và ưu đãi thuê sách độc quyền</p>
          <form className={styles.subscriptionForm}>
            <input type="email" placeholder="Nhập địa chỉ email của bạn" />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;