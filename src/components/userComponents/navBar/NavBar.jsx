"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ShoppingCart, User, Menu, X, LogOut, BookOpen } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import { useCart } from "../../../contexts/CartContext"
import styles from "./NavBar.module.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { currentUser, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Theo dõi scroll để thay đổi style của navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <BookOpen size={24} />
          <span>BookRental</span>
        </Link>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>

        <div className={styles.desktopMenu}>
          <Link to="/" className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}>
            Trang chủ
          </Link>
          <Link to="/search" className={`${styles.navLink} ${location.pathname === "/search" ? styles.active : ""}`}>
            Danh mục
          </Link>
          <Link to="/about" className={`${styles.navLink} ${location.pathname === "/about" ? styles.active : ""}`}>
            Giới thiệu
          </Link>
          <Link to="/contact" className={`${styles.navLink} ${location.pathname === "/contact" ? styles.active : ""}`}>
            Liên hệ
          </Link>

          {currentUser ? (
            <>
              <Link to="/cart" className={styles.cartLink}>
                <ShoppingCart size={20} />
                {cartItems.length > 0 && <span className={styles.cartBadge}>{cartItems.length}</span>}
              </Link>
              <div className={styles.userMenu}>
                <button className={styles.userButton}>
                  <User size={20} />
                  <span>{currentUser.full_name}</span>
                </button>
                <div className={styles.userDropdown}>
                  <Link to="/profile">Thông tin cá nhân</Link>
                  <Link to="/orders">Đơn hàng của tôi</Link>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginButton}>
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.registerButton}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>

          <Link to="/" className={`${styles.mobileNavLink} ${location.pathname === "/" ? styles.active : ""}`}>
            Trang chủ
          </Link>
          <Link
            to="/search"
            className={`${styles.mobileNavLink} ${location.pathname === "/search" ? styles.active : ""}`}
          >
            Danh mục
          </Link>
          <Link
            to="/about"
            className={`${styles.mobileNavLink} ${location.pathname === "/about" ? styles.active : ""}`}
          >
            Giới thiệu
          </Link>
          <Link
            to="/contact"
            className={`${styles.mobileNavLink} ${location.pathname === "/contact" ? styles.active : ""}`}
          >
            Liên hệ
          </Link>

          {currentUser ? (
            <>
              <Link to="/cart" className={styles.mobileNavLink}>
                Giỏ hàng ({cartItems.length})
              </Link>
              <Link to="/profile" className={styles.mobileNavLink}>
                Thông tin cá nhân
              </Link>
              <Link to="/orders" className={styles.mobileNavLink}>
                Đơn hàng của tôi
              </Link>
              <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileNavLink}>
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.mobileNavLink}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
