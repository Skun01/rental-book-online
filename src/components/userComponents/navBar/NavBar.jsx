import { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import {
  BookOpen, Home, ShoppingCart, Search, User, LogOut, LogIn, UserPlus,
  X, Menu, Library, History
} from "lucide-react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  
  // Memoize cart item count to prevent unnecessary recalculations
  const cartItemCount = useMemo(() => getCartItemCount(), [getCartItemCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (navRef.current && !navRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Properly encode search query for URL
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      navigate(`/books?search=${encodedQuery}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          <BookOpen size={24} />
          <span>Thuê Sách</span>
        </Link>

        <form className={styles.navbarSearch} onSubmit={handleSearch} role="search">
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Tìm kiếm"
          />
          <button type="submit" className={styles.searchButton} aria-label="Tìm kiếm">
            <Search className={styles.searchIcon} size={18} />
          </button>
        </form>

        <div className={styles.navbarLinks}>
          <NavLink to="/" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`} end>
            <Home size={20} />
            <span>Trang chủ</span>
          </NavLink>

          <NavLink to="/books" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`}>
            <Library size={20} />
            <span>Sách</span>
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`}>
            <div className={styles.cartIcon}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className={styles.cartCount} aria-label={`${cartItemCount} sản phẩm trong giỏ hàng`}>{cartItemCount}</span>}
            </div>
            <span>Giỏ Hang</span>
          </NavLink>

          {currentUser ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button 
                className={styles.dropdownButton} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="Menu người dùng"
              >
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name)}`}
                  alt={`Ảnh đại diện của ${currentUser.full_name}`}
                />
                <span>{currentUser.full_name.split(" ")[0]}</span>
              </button>

              <div 
                className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuActive : ""}`}
                role="menu"
                aria-hidden={!dropdownOpen}
              >
                <div className={styles.dropdownHeader}>
                  <h3>{currentUser.full_name}</h3>
                  <p>{currentUser.email}</p>
                </div>
                <div className={styles.dropdownItems}>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)} role="menuitem">
                    <User size={18} />
                    <span>Hồ sơ của tôi</span>
                  </Link>
                  <Link to="/rental-history" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)} role="menuitem">
                    <History size={18} />
                    <span>Lịch sử thuê</span>
                  </Link>
                  <div className={styles.dropdownDivider} role="separator"></div>
                  <button className={styles.logoutButton} onClick={handleLogout} role="menuitem">
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navbarLink}>
                <LogIn size={20} />
                <span>Đăng nhập</span>
              </Link>
              <Link to="/register" className={styles.navbarLink}>
                <UserPlus size={20} />
                <span>Đăng ký</span>
              </Link>
            </>
          )}
        </div>

        <button 
          className={styles.mobileMenuButton} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div 
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuActive : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <form className={styles.mobileSearch} onSubmit={handleSearch} role="search">
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Tìm kiếm"
          />
          <button type="submit" className={styles.searchButton} aria-label="Tìm kiếm">
            <Search className={styles.searchIcon} size={18} />
          </button>
        </form>

        <div className={styles.mobileLinks}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <Home size={20} />
            <span>Trang chủ</span>
          </NavLink>

          <NavLink
            to="/books"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Library size={20} />
            <span>Sách</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={styles.cartIcon}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className={styles.cartCount} aria-label={`${cartItemCount} sản phẩm trong giỏ hàng`}>{cartItemCount}</span>}
            </div>
            <span>Giỏ hàng</span>
          </NavLink>

          {currentUser ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Hồ sơ của tôi</span>
              </NavLink>

              <NavLink
                to="/rental-history"
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <History size={20} />
                <span>Lịch sử thuê</span>
              </NavLink>

              <div className={styles.mobileDivider} role="separator"></div>

              <button className={styles.mobileLink} onClick={handleLogout}>
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <LogIn size={20} />
                <span>Đăng nhập</span>
              </Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={20} />
                <span>Đăng ký</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;