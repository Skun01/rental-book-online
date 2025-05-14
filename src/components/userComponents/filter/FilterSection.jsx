"use client"

import { useState, useEffect } from "react"
import { Filter, ChevronDown, X, Star } from "lucide-react"
import styles from "./FilterSection.module.css"

const FilterSection = () => {
  // Mock data
  const mockCategories = [
    { id: 1, name: "Tiểu thuyết" },
    { id: 2, name: "Khoa học" },
    { id: 3, name: "Lịch sử" },
    { id: 4, name: "Kinh tế" },
    { id: 5, name: "Tâm lý học" },
  ]

  const mockAuthors = [
    { id: 1, name: "Nguyễn Nhật Ánh" },
    { id: 2, name: "Paulo Coelho" },
    { id: 3, name: "Dale Carnegie" },
    { id: 4, name: "Tô Hoài" },
    { id: 5, name: "Nguyễn Du" },
  ]

  // State
  const [showFilters, setShowFilters] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    author: "",
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    availability: "",
    rating: "",
  })
  
  // For price filter debounce
  const [priceInput, setPriceInput] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice
  })

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
  
  // Get the category name for display
  const getCategoryName = () => {
    if (!filters.category) return null
    const category = mockCategories.find((c) => c.id === Number.parseInt(filters.category))
    return category ? category.name : null
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchHeader}>
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
    </div>
  )
}

export default FilterSection