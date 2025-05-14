"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Filter, ChevronDown, X, ChevronRight, Home, Star } from "lucide-react"
import BookCard from "../../../components/userComponents/bookCard/BookCard"
import { mockBooks, mockCategories, mockAuthors } from "../../../mockData"
import styles from "./Backup.module.css"

// Custom hook for debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [displayedBooks, setDisplayedBooks] = useState([])
  
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    author: searchParams.get("author") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    availability: searchParams.get("availability") || "",
    rating: searchParams.get("rating") || "",
  })
  
  // For price filter debounce
  const [priceInput, setPriceInput] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice
  })
  
  const debouncedMinPrice = useDebounce(priceInput.minPrice, 500)
  const debouncedMaxPrice = useDebounce(priceInput.maxPrice, 500)
  
  const [showFilters, setShowFilters] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Fetch books on initial load
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call with query params
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
        setBooks(mockBooks)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooks()
  }, [])

  // Apply debounced price filters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice
    }))
  }, [debouncedMinPrice, debouncedMaxPrice])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.query) count++
    if (filters.category) count++
    if (filters.author) count++
    if (filters.availability) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.rating) count++
    setActiveFiltersCount(count)
  }, [filters])

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
          (book.description && book.description.toLowerCase().includes(query)),
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
    
    // Apply rating filter
    if (filters.rating) {
      const minRating = Number.parseFloat(filters.rating)
      results = results.filter((book) => (book.rating || 0) >= minRating)
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
    } else if (filters.sort === "rating-desc") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredBooks(results)
    setTotalPages(Math.ceil(results.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [books, filters, itemsPerPage])
  
  // Update displayed books based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedBooks(filteredBooks.slice(startIndex, endIndex))
  }, [filteredBooks, currentPage, itemsPerPage])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)
    if (filters.category) params.set("category", filters.category)
    if (filters.author) params.set("author", filters.author)
    if (filters.sort) params.set("sort", filters.sort)
    if (filters.availability) params.set("availability", filters.availability)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.rating) params.set("rating", filters.rating)

    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target
    setPriceInput(prev => ({
      ...prev,
      [name]: value
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
      rating: "",
    })
    setPriceInput({
      minPrice: "",
      maxPrice: ""
    })
  }
  
  const removeFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ""
    }))
    
    if (filterName === "minPrice" || filterName === "maxPrice") {
      setPriceInput(prev => ({
        ...prev,
        [filterName]: ""
      }))
    }
  }
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top of results
    document.querySelector(`.${styles.resultsSection}`).scrollIntoView({ behavior: 'smooth' })
  }
  
  // Get the category name for breadcrumb
  const getCategoryName = () => {
    if (!filters.category) return null
    const category = mockCategories.find((c) => c.id === Number.parseInt(filters.category))
    return category ? category.name : null
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxPagesToShow = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className={styles.pagination}>
        <button 
          className={styles.pageButton} 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo;
        </button>
        
        {startPage > 1 && (
          <>
            <button className={styles.pageButton} onClick={() => handlePageChange(1)}>1</button>
            {startPage > 2 && <span className={styles.pageEllipsis}>...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`${styles.pageButton} ${currentPage === number ? styles.activePage : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.pageEllipsis}>...</span>}
            <button className={styles.pageButton} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className={styles.pageButton} 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &raquo;
        </button>
      </div>
    )
  }

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        <div className={styles.searchHeader}>
          <h1 className={styles.pageTitle}>
            {filters.query
              ? `Kết quả tìm kiếm cho "${filters.query}"`
              : filters.category
                ? `Danh mục: ${getCategoryName() || "Không xác định"}`
                : "Tất cả sách"}
          </h1>

          <button className={styles.filterToggle} onClick={toggleFilters}>
            <Filter size={18} />
            <span>Bộ lọc {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}</span>
            <ChevronDown size={16} className={showFilters ? styles.rotated : ""} />
          </button>
        </div>
        
        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className={styles.activeFilters}>
            {filters.query && (
              <div className={styles.filterChip}>
                <span>Từ khóa: {filters.query}</span>
                <button onClick={() => removeFilter("query")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.category && (
              <div className={styles.filterChip}>
                <span>Danh mục: {getCategoryName()}</span>
                <button onClick={() => removeFilter("category")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.author && (
              <div className={styles.filterChip}>
                <span>Tác giả: {filters.author}</span>
                <button onClick={() => removeFilter("author")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.availability && (
              <div className={styles.filterChip}>
                <span>Tình trạng: {filters.availability === "available" ? "Còn sách" : "Hết sách"}</span>
                <button onClick={() => removeFilter("availability")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.minPrice && (
              <div className={styles.filterChip}>
                <span>Giá từ: {filters.minPrice}đ</span>
                <button onClick={() => removeFilter("minPrice")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.maxPrice && (
              <div className={styles.filterChip}>
                <span>Giá đến: {filters.maxPrice}đ</span>
                <button onClick={() => removeFilter("maxPrice")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.rating && (
              <div className={styles.filterChip}>
                <span>Đánh giá: {filters.rating}+ <Star size={14} className={styles.starIcon} /></span>
                <button onClick={() => removeFilter("rating")} className={styles.removeFilter}>
                  <X size={14} />
                </button>
              </div>
            )}
            <button className={styles.clearAllButton} onClick={clearFilters}>
              Xóa tất cả
            </button>
          </div>
        )}

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
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="rating" className={styles.filterLabel}>
                Đánh giá tối thiểu
              </label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4+ sao</option>
                <option value="3">3+ sao</option>
                <option value="2">2+ sao</option>
                <option value="1">1+ sao</option>
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
                value={priceInput.minPrice}
                onChange={handlePriceInputChange}
                className={styles.priceInput}
              />
              <span className={styles.priceSeparator}>-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Đến"
                value={priceInput.maxPrice}
                onChange={handlePriceInputChange}
                className={styles.priceInput}
              />
            </div>
          </div>
          
          <div className={styles.filterActions}>
            <button className={styles.clearFiltersButton} onClick={clearFilters}>
              Xóa bộ lọc
            </button>
            <button className={styles.applyFiltersButton} onClick={() => setShowFilters(false)}>
              Áp dụng
            </button>
          </div>
        </div>

        <div className={styles.resultsSection}>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={styles.skeletonItem}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonAuthor}></div>
                    <div className={styles.skeletonPrice}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className={styles.noResults}>
              <h2>Không tìm thấy kết quả</h2>
              <p>Vui lòng thử lại với các bộ lọc khác.</p>
              <button className={styles.clearFiltersButton} onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <div className={styles.resultsCount}>Tìm thấy {filteredBooks.length} kết quả</div>
                <div className={styles.itemsPerPageControl}>
                  <label htmlFor="itemsPerPage">Hiển thị:</label>
                  <select 
                    id="itemsPerPage" 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                  </select>
                </div>
              </div>

              <div className={styles.booksGrid}>
                {displayedBooks.map((book) => (
                  <div key={book.id} className={styles.bookItem}>
                    <BookCard book={book} showBookDetail={false} />
                  </div>
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
