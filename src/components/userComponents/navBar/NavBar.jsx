"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ShoppingCart, User, Menu, X, LogOut, BookOpen, UserCircle, ClipboardList } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import { useCart } from "../../../contexts/CartContext"
import { popularSearchTerms } from "../../../mockData"
import styles from "./NavBar.module.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const lastScrollY = useRef(0)
  const { currentUser, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)

  // Theo dõi scroll để thay đổi style của navbar và ẩn/hiện navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Cập nhật scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)

      // Xử lý ẩn/hiện navbar
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsNavbarVisible(false)
      } else {
        // Scrolling up
        setIsNavbarVisible(true)
      }
      
      lastScrollY.current = currentScrollY
      
      // Xử lý style khi scroll
      if (currentScrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setIsMenuOpen(false)
    setShowSearchSuggestions(false)
  }, [location.pathname])

  // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter search suggestions based on input
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([])
      return
    }

    const filtered = popularSearchTerms
      .filter((term) => term.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5) // Limit to 5 suggestions

    setFilteredSuggestions(filtered)
  }, [searchQuery])

  // Sync search query with URL when on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const searchParams = new URLSearchParams(location.search);
      const queryParam = searchParams.get("q");
      if (queryParam) {
        // Chỉ cập nhật nếu giá trị khác
        if (searchQuery !== queryParam) {
          setSearchQuery(queryParam);
        }
      }
    }
  }, [location.pathname, location.search]);

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true })
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setSearchQuery("")
        setShowSearchSuggestions(false)
      } catch (error) {
        console.error("Error navigating to search results:", error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleSuggestionClick = async (suggestion) => {
    setIsSearching(true)
    try {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`, { replace: true })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      setSearchQuery("")
      setShowSearchSuggestions(false)
    } catch (error) {
      console.error("Error navigating to search results:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== "") {
      setShowSearchSuggestions(true)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSearchSuggestions(e.target.value.trim() !== "")
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav 
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${
        !isNavbarVisible ? styles.hidden : ""
      }`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <BookOpen size={24} />
          <span>BookRental</span>
        </Link>

        <div className={styles.searchForm} ref={searchRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleSearchKeyDown}
              className={styles.searchInput}
            />
            <button 
              type="submit" 
              className={`${styles.searchButton} ${isSearching ? styles.loading : ""}`}
              disabled={isSearching}
            >
              <Search size={20} />
            </button>
          </form>

          {showSearchSuggestions && filteredSuggestions.length > 0 && (
            <div className={`${styles.searchSuggestions} ${showSearchSuggestions ? styles.show : ""}`}>
              {filteredSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={styles.suggestionItem} 
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search size={14} />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.desktopMenu}>
          <Link to="/" className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}>
            Danh mục
          </Link>
          <Link to="/search" className={`${styles.navLink} ${location.pathname === "/search" ? styles.active : ""}`}>
            Sách
          </Link>
          <Link to="/renting" className={`${styles.navLink} ${location.pathname === "/about" ? styles.active : ""}`}>
            Đang thuê
          </Link>
          <Link to="/overRenting" className={`${styles.navLink} ${location.pathname === "/contact" ? styles.active : ""}`}>
            Quá hạn
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
                  <Link to="/profile">
                    <UserCircle size={16} />
                    <span>Thông tin cá nhân</span>
                  </Link>
                  <Link to="/orders">
                    <ClipboardList size={16} />
                    <span>Đơn hàng của tôi</span>
                  </Link>
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
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
        <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
          <button type="submit" className={isSearching ? styles.loading : ""} disabled={isSearching}>
            <Search size={20} />
          </button>
        </form>

        <Link 
          to="/" 
          className={`${styles.mobileNavLink} ${location.pathname === "/" ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Trang chủ
        </Link>
        <Link
          to="/search"
          className={`${styles.mobileNavLink} ${location.pathname === "/search" ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Danh mục
        </Link>
        <Link
          to="/about"
          className={`${styles.mobileNavLink} ${location.pathname === "/about" ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Giới thiệu
        </Link>
        <Link
          to="/contact"
          className={`${styles.mobileNavLink} ${location.pathname === "/contact" ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Liên hệ
        </Link>

        {currentUser ? (
          <>
            <Link 
              to="/cart" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Giỏ hàng ({cartItems.length})
            </Link>
            <Link 
              to="/profile" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Thông tin cá nhân
            </Link>
            <Link 
              to="/orders" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Đơn hàng của tôi
            </Link>
            <button onClick={handleLogout} className={styles.mobileLogoutButton}>
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Đăng nhập
            </Link>
            <Link 
              to="/register" 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>

      {/* Scroll progress bar */}
      <div 
        className={styles.scrollProgress} 
        style={{ width: `${scrollProgress}%` }} 
      />
    </nav>
  )
}

export default Navbar
