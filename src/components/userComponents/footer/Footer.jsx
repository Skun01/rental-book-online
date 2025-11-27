import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, BookOpen, Github } from "lucide-react"
import styles from "./Footer.module.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <Link to="/" className={styles.logo}>
              <BookOpen size={24} />
              <span>Thuê sách</span>
            </Link>
            <p className={styles.description}>
              Dịch vụ cho thuê sách hàng đầu Việt Nam với hàng ngàn đầu sách chất lượng.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>0973402957</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>hoainam0660@gmail.com</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>Minh Khai, Bắc Từ Liêm, Hà Nội</span>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Danh mục</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/search?category=1">Văn học</Link>
              </li>
              <li>
                <Link to="/search?category=2">Kinh tế</Link>
              </li>
              <li>
                <Link to="/search?category=3">Kỹ năng sống</Link>
              </li>
              <li>
                <Link to="/search?category=4">Sách thiếu nhi</Link>
              </li>
              <li>
                <Link to="/search?category=5">Sách ngoại ngữ</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Thông tin</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/about">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Tác giả</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/">Đỗ Hoài Nam</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Sản phẩm đồ án</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
