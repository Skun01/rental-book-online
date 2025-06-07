import { useState, useEffect } from "react"
import { Filter, ChevronDown, X, Star } from "lucide-react"
import styles from "./FilterSection.module.css"
import axios from 'axios'

const FilterSection = ({setFilterList}) => {
  // Get data
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  useEffect(()=>{
    async function getCategories(){
      await axios.get('http://localhost:8080/api/v1/category/all?page=0&size=100')
        .then(response=>{
          setCategories(response.data.data.content)
        })
    }

    async function getAuthors(){
      await axios.get('http://localhost:8080/api/v1/author/all?page=0&size=100')
        .then(response=>{
          setAuthors(response.data.data.content)
        })
    }
    getCategories()
    getAuthors()
  }, [])

  // State
  const [showFilters, setShowFilters] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [filters, setFilters] = useState({
    query: "",
    categoryId: "",
    authorId: "",
    sort: "",
    minPrice: "",
    maxPrice: "",
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
    if (filters.categoryId) count++
    if (filters.authorId) count++
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
      categoryId: "",
      authorId: "",
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      rating: "",
    })
    setPriceInput({
      minPrice: "",
      maxPrice: ""
    })
    setFilterList(null)
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
  // Get the category and author name for display
  const getCategoryName = () => {
    if (!filters.categoryId) return null
    const category = categories.find((c) => c.id === +filters.categoryId)
    return category ? category.name : null
  }

  const getAuthorName = () => {
    if(!filters.authorId) return null
    const author = authors.find((a) => a.id === +filters.authorId)
    return author ? author.name : null
  }

  // handle submit filter
  function handleSubmitFilter(){
    setShowFilters(false)
    setFilterList(filters)
  }

  // handle cancel filter
  function handleCancelFilter(){
    clearFilters()
    setFilterList(null)
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
          {filters.categoryId && (
            <div className={styles.filterChip}>
              <span>Danh mục: {getCategoryName()}</span>
              <button onClick={() => removeFilter("categoryId")} className={styles.removeFilter}>
                <X size={14} />
              </button>
            </div>
          )}
          {filters.authorId && (
            <div className={styles.filterChip}>
              <span>Tác giả: {getAuthorName()}</span>
              <button onClick={() => removeFilter("authorId")} className={styles.removeFilter}>
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
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={+category.id}>
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
              name="authorId"
              value={filters.authorId}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">Tất cả tác giả</option>
              {authors.map((author) => (
                <option key={author.id} value={+author.id}>
                  {author.name}
                </option>
              ))}
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
              <option value="sortBy=publish_date&sortDir=asc">Mới nhất</option>
              <option value="sortBy=publish_date&sortDir=desc">Cũ nhất</option>
              <option value="sortBy=rentalPrice&sortDir=asc">Giá tăng dần</option>
              <option value="sortBy=rentalPrice&sortDir=desc">Giá giảm dần</option>
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
          <button className={styles.clearFiltersButton} onClick={handleCancelFilter}>
            Xóa bộ lọc
          </button>
          <button className={styles.applyFiltersButton} onClick={handleSubmitFilter}>
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSection