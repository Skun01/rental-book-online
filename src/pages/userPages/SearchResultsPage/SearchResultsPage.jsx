import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Filter, ChevronDown } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import { mockBooks, mockCategories, mockAuthors } from "../../../mockData"
import styles from "./SearchResultsPage.module.css"

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    author: searchParams.get("author") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: "",
    maxPrice: "",
    availability: searchParams.get("availability") || "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch books on initial load
  useEffect(() => {
    // In a real app, this would be an API call with query params
    setBooks(mockBooks)
    setLoading(false)
  }, [])

  // Apply filters when books or filters change
  useEffect(() => {
    if (books.length === 0) return

    let results = [...books]

    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter((book) => book.category_id === Number.parseInt(filters.category))
    }

    // Apply author filter
    if (filters.author) {
      results = results.filter((book) => book.author.toLowerCase().includes(filters.author.toLowerCase()))
    }

    // Apply price range filter
    if (filters.minPrice) {
      results = results.filter((book) => book.rental_price >= Number.parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      results = results.filter((book) => book.rental_price <= Number.parseInt(filters.maxPrice))
    }

    // Apply availability filter
    if (filters.availability === "available") {
      results = results.filter((book) => book.available_quantity > 0)
    } else if (filters.availability === "unavailable") {
      results = results.filter((book) => book.available_quantity <= 0)
    }

    // Apply sorting
    if (filters.sort === "newest") {
      results.sort((a, b) => b.publish_year - a.publish_year)
    } else if (filters.sort === "oldest") {
      results.sort((a, b) => a.publish_year - b.publish_year)
    } else if (filters.sort === "price-asc") {
      results.sort((a, b) => a.rental_price - b.rental_price)
    } else if (filters.sort === "price-desc") {
      results.sort((a, b) => b.rental_price - a.rental_price)
    }

    setFilteredBooks(results)
  }, [books, filters])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)
    if (filters.category) params.set("category", filters.category)
    if (filters.author) params.set("author", filters.author)
    if (filters.sort) params.set("sort", filters.sort)
    if (filters.availability) params.set("availability", filters.availability)

    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      author: "",
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      availability: "",
    })
  }

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        <div className={styles.searchHeader}>
          <h1 className={styles.pageTitle}>
            {filters.query
              ? `Kết quả tìm kiếm cho "${filters.query}"`
              : filters.category
                ? `Danh mục: ${mockCategories.find((c) => c.id === Number.parseInt(filters.category))?.name || ""}`
                : "Tất cả sách"}
          </h1>

          <button className={styles.filterToggle} onClick={toggleFilters}>
            <Filter size={18} />
            <span>Bộ lọc</span>
            <ChevronDown size={16} className={showFilters ? styles.rotated : ""} />
          </button>
        </div>

        <div className={`${styles.filtersSection} ${showFilters ? styles.show : ""}`}>
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label htmlFor="category" className={styles.filterLabel}>
                Danh mục
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">Tất cả danh mục</option>
                {mockCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="author" className={styles.filterLabel}>
                Tác giả
              </label>
              <select
                id="author"
                name="author"
                value={filters.author}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">Tất cả tác giả</option>
                {mockAuthors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="availability" className={styles.filterLabel}>
                Tình trạng
              </label>
              <select
                id="availability"
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">Tất cả</option>
                <option value="available">Còn sách</option>
                <option value="unavailable">Hết sách</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="sort" className={styles.filterLabel}>
                Sắp xếp
              </label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Giá thuê</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className={styles.priceInput}
                />
                <span className={styles.priceSeparator}>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className={styles.priceInput}
                />
              </div>
          </div>
          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>

        <div className={styles.resultsSection}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : filteredBooks.length === 0 ? (
            <div className={styles.noResults}>
              <h2>Không tìm thấy kết quả</h2>
              <p>Vui lòng thử lại với các bộ lọc khác.</p>
            </div>
          ) : (
            <>
              <div className={styles.resultsCount}>Tìm thấy {filteredBooks.length} kết quả</div>

              <div className={styles.booksGrid}>
                {filteredBooks.map((book) => (
                  <div key={book.id} className={styles.bookItem}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage