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
                <span>0374963082</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>truongg9655@gmail.com</span>
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
            <h3 className={styles.footerTitle}>Các thành viên trong nhóm</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/">Thái Văn Trường</Link>
              </li>
              <li>
                <Link to="/">Trần Đức Trưởng</Link>
              </li>
              <li>
                <Link to="/">Nguyễn Văn Thưởng</Link>
              </li>
            </ul>
            
            <div className={styles.socialLinks}>
              <a href="https://github.com/Skun01/Do_An_Chuyen_Nganh_nhom_3" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Sản phẩm bài tập lớn của nhóm 3</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
