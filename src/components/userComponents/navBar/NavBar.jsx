import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useUser } from "../../../contexts/UserContext"
import { useCart } from "../../../contexts/CartContext"
import {
  BookOpen, Home, ShoppingCart, Search, User, LogOut, LogIn, UserPlus,
  X, Menu, Library, History
} from "lucide-react"
import "./NavBar.css"

const NavBar = () => {
  const { user, logout } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <BookOpen size={24} />
          Thuê Sách
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </form>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`} end>
            <Home size={20} />
            Trang chủ
          </NavLink>

          <NavLink to="/books" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
            <Library size={20} />
            Sách
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
            <div className="cart-icon">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </div>
            Giỏ hàng
          </NavLink>

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name)}
                  alt={user.full_name}
                />
                <span>{user.full_name.split(" ")[0]}</span>
              </button>

              <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
                <div className="dropdown-header">
                  <h3>{user.full_name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="dropdown-items">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={18} />
                    Hồ sơ của tôi
                  </Link>
                  <Link to="/rental-history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <History size={18} />
                    Lịch sử thuê
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <LogIn size={20} />
                Đăng nhập
              </Link>
              <Link to="/register" className="navbar-link">
                <UserPlus size={20} />
                Đăng ký
              </Link>
            </>
          )}
        </div>

        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <form className="mobile-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </form>

        <div className="mobile-links">
          <NavLink
            to="/"
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <Home size={20} />
            Trang chủ
          </NavLink>

          <NavLink
            to="/books"
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Library size={20} />
            Sách
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="cart-icon">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </div>
            Giỏ hàng
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                Hồ sơ của tôi
              </NavLink>

              <NavLink
                to="/rental-history"
                className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <History size={20} />
                Lịch sử thuê
              </NavLink>

              <div className="mobile-divider"></div>

              <button className="mobile-link" onClick={handleLogout}>
                <LogOut size={20} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <LogIn size={20} />
                Đăng nhập
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={20} />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar