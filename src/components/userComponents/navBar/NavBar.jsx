import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ShoppingCart, User, ChevronDown, Bell } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import { useCart } from "../../../contexts/CartContext"
import styles from "./NavBar.module.css"
import UserMenu from "./UserMenu"
import SearchSuggest from "./SearchSuggest"
import Login from "../../../pages/Login"
import Register from "../../../pages/Register"
import axios from "axios"


function NavBar(){
  const [isScorred, setIsScored]= useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { currentUser, logout } = useAuth();
  const { getCartItemCount, handlePostCart } = useCart();
  const [categories, setCategories] = useState()
  const navigate = useNavigate();
  const location = useLocation();
   const searchRef = useRef(null);
  useEffect(() => {
    const handleScroll = () =>{
      setIsScored(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    async function getCategories(){
      await axios.get('http://localhost:8080/api/v1/category/all?page=0&size=100&sortDir=asc&status=Active')
        .then(response=>{
          setCategories(response.data.data.content)
        })
    }
    getCategories()
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    
  }, []);

  // Sync search query with URL when on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const searchParams = new URLSearchParams(location.search);
      const queryParam = searchParams.get("q");
      if (queryParam && searchTerm !== queryParam) {
        setSearchTerm(queryParam);
      }
    }
  }, [location.pathname, location.search]);

   // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggest(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

   // Close menu when changing pages
  useEffect(() => {
    setUserMenuOpen(false);
    setShowSuggest(false);
  }, [location.pathname]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        
        // Allow a little time for the navigation to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setShowSuggest(false);
      } catch (error) {
        console.error("Error navigating to search results:", error);
      }
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim() !== "") {
      setShowSuggest(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggest(e.target.value.trim() !== "");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  // authorization
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuthModal = () => {
    setShowAuth(false);
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
  };

  // handle logout
  const handleLogout = () =>{
    logout();
    handlePostCart();
  }

  return(
    <>
      <div className={`${styles.navBar} ${isScorred ? styles.navBarScorred : ""}`}>
        <div className={styles.navBarTitle}>
          <Link to="/">
            <p>Hoài Nam</p>
          </Link>
        </div>

        {/* searching */}
        <div className={styles.navBarSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm sách..."
            value={searchTerm}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
            onChange={handleSearchChange}
          />
          <Search className={styles.searchIcon} />
          {showSuggest && (
            <SearchSuggest 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              setShowSuggest={setShowSuggest}
            />
          )}
        </div>

        {/* menu */}
        <ul className={styles.mainMenu}>
          <li className={styles.menuItem}>
            <Link to="/books">Sách</Link>
          </li>
          <li className={`${styles.menuItem} ${styles.menuSub}`}>
              <p>Thể loại </p>
              <ChevronDown className={styles.chevronDown}/>
              <ul className={styles.subMenu}>
                {categories && categories.map((item) => (
                  <li key={item.id} className={styles.subMenuItem}>
                    <Link to={`/search?q=${item.name}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
          </li>
          <li className={styles.menuItem}>
            <Link to="/categories">Chủ đề</Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/authors">Tác giả</Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/rented-books">Sách đang thuê</Link>
          </li>
        </ul>

        {/* authentication */}
        <div className={styles.mainUser}>
          {currentUser ? (
            <div className = {styles.userInfor}>
              <Link to="/cart">
                <div className={styles.cart}>
                  <ShoppingCart className={styles.cartIcon}/>
                  <div className={styles.cartCount}>{getCartItemCount()}</div>
                </div>
              </Link>
              <div className={styles.user}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userAvatar}>
                  <img src="/avatar.jpg" alt="avatar" />
                </div>
                <ChevronDown className={styles.chevronDown}/>
                {userMenuOpen && (
                  <UserMenu username={currentUser.name} handleLogout={handleLogout} />
                )}
              </div>
            </div>
          ): (
            <div className={styles.loginBtn}
              onClick={() => openAuthModal("login")}
            >
              <User/>
              <p>Thành viên</p>
          </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        authMode === "login" ? (
          <Login 
            onClose={closeAuthModal} 
            switchToRegister={() => switchAuthMode("register")} 
          />
        ) : (
          <Register 
            onClose={closeAuthModal} 
            switchToLogin={() => switchAuthMode("login")} 
          />
        )
      )}
    </>
  )
}

export default NavBar;