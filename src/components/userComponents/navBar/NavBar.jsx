import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useCart } from "../../../contexts/CartContext";
import {
  BookOpen, Home, ShoppingCart, Search, User, LogOut, LogIn, UserPlus,
  X, Menu, Library, History
} from "lucide-react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          <BookOpen size={24} />
          Thuê Sách
        </Link>

        <form className={styles.navbarSearch} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className={styles.searchIcon} size={18} />
        </form>

        <div className={styles.navbarLinks}>
          <NavLink to="/" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`} end>
            <Home size={20} />
            Trang chủ
          </NavLink>

          <NavLink to="/books" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`}>
            <Library size={20} />
            Sách
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `${styles.navbarLink} ${isActive ? styles.navbarLinkActive : ""}`}>
            <div className={styles.cartIcon}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
            </div>
            Giỏ hàng
          </NavLink>

          {user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button className={styles.dropdownButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name)}
                  alt={user.full_name}
                />
                <span>{user.full_name.split(" ")[0]}</span>
              </button>

              <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuActive : ""}`}>
                <div className={styles.dropdownHeader}>
                  <h3>{user.full_name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className={styles.dropdownItems}>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <User size={18} />
                    Hồ sơ của tôi
                  </Link>
                  <Link to="/rental-history" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <History size={18} />
                    Lịch sử thuê
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.logoutButton} onClick={handleLogout}>
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navbarLink}>
                <LogIn size={20} />
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.navbarLink}>
                <UserPlus size={20} />
                Đăng ký
              </Link>
            </>
          )}
        </div>

        <button className={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuActive : ""}`}>
        <form className={styles.mobileSearch} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả hoặc thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className={styles.searchIcon} size={18} />
        </form>

        <div className={styles.mobileLinks}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <Home size={20} />
            Trang chủ
          </NavLink>

          <NavLink
            to="/books"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Library size={20} />
            Sách
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={styles.cartIcon}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
            </div>
            Giỏ hàng
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                Hồ sơ của tôi
              </NavLink>

              <NavLink
                to="/rental-history"
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <History size={20} />
                Lịch sử thuê
              </NavLink>

              <div className={styles.mobileDivider}></div>

              <button className={styles.mobileLink} onClick={handleLogout}>
                <LogOut size={20} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <LogIn size={20} />
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={20} />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;