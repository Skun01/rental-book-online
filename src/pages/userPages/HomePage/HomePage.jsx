import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Send } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import BookCardOrder from "../../../components/userComponents/bookCardOrder/BookCardOrder"
import CategoryCard from "../../../components/userComponents/categoryCard/CategoryCard" 
import BookSlider from "./BookSlider"
import styles from "./HomePage.module.css"
import axios from "axios"
import { useAuth } from "../../../contexts/AuthContext"

const HomePage = () => {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState("")
  const {currentUser} = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // get book backend
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("http://localhost:8080/api/v1/book/all?page=0&size=12")
        setBooks(booksResponse.data.data.result.content)
      } catch (error) {
        console.error("Error fetching books data:", error)
      } finally {
        setIsLoading(false)
      }
    };
    fetchData();
  }, []);

  //get category backend
  useEffect(()=>{
    const fetchData = async () => {
      try {
       await axios.get("http://localhost:8080/api/v1/category/all?page=0&size=12&sortDir=asc&status=Active")
        .then(response=>{
          setCategories(response.data.data.content)
        })
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    };
    fetchData();
  }, []);

  // tự động scroll lên đầu trang khi dữ liệu đã được tải xong
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isLoading]) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post(`http://localhost:8080/api/v1/subscribe/create`,
        {
          fullName: currentUser.id,
          email: email,
          age: currentUser.age,
          gender: currentUser.gender,
        }
      )
      console.log(res)
      setEmail("")
      alert("Đăng ký nhận thông báo thành công!")
    }catch(err){
      console.error(`can't subcrise email: `, err)
    }
    
  }

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

      {/* bookslider để làm đẹp thôi :) */}
      <BookSlider />

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Bạn đang quan tâm chủ đề gì?</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.slice(0, 5).map((category, index) => (
              <Link key={category.id} to={`/categories/${category.id}`}>
                <CategoryCard categoryName={category.name} categoryOrder={index} />
              </Link>
            ))}
            {categories.length > 5 && (
            <Link to="/categories" className={styles.viewAllLink}>
              <div className={styles.categoriesMore}>
                + {categories.length - 5} chủ đề khác
              </div>
            </Link>
          )}
          </div>
        </div>
      </section>

      {/* Mới phát hành */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mới phát hành</h2>
          </div>
          <div className={styles.booksGrid}>
            {books.slice(0, 10).map((book) => (
              <BookCard key={book.id} book={book} releaseYear={2025}/>
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 sách bán chạy */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top 10 được thuê nhiều nhất</h2>
          </div>
          <div className={styles.booksGrid}>
            {books.slice(0, 10).map((book, index) => (
              <BookCardOrder key={book.id} book={book} orderNumber={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Sách tuổi trẻ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dành cho tuổi teen</h2>
          </div>
          <div className={styles.booksGrid}>
            {books.length > 0 ? books.map((book) => (
              <BookCard key={book.id} book={book}/>
            )) : books.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book}/>
            ))}
          </div>
        </div>
      </section>

      {/* Gợi ý cho bạn */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Gợi ý cho bạn</h2>
          </div>
          <div className={styles.booksGrid}>
            {books.slice(0, 10).map((book) => (
              <BookCard key={book.id} book={book}/>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Nhận thông báo về sách mới</h2>
            <p className={styles.ctaText}>Nhập email để nhận thông báo về sách mới, khuyến mãi và các sự kiện</p>
            <form onSubmit={handleSubmit} className={styles.ctaForm}>
              <input 
                type="email" 
                className={styles.ctaInput} 
                placeholder="Nhập địa chỉ email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.ctaButton}>
                Đăng ký ngay <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage