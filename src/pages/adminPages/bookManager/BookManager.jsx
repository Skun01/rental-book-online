import styles from "./BookManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Plus, Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import Notification from "../../../components/adminComponents/notification/Notification"
import BookForm from "../../../components/adminComponents/bookForm/BookForm"
import {allBookGet, bookDelete, updateBookPut, createBookPost} from "../../../api/bookApi"
import {allCategoryGet} from "../../../api/categoryApi"
import {allAuthorGet} from "../../../api/authorApi"
import { useToast } from "../../../contexts/ToastContext"

const token = localStorage.getItem('token')

const uploadImageApi = async (file, token) => {
  try {
    const formData = new FormData()
    formData.append('files', file)
    
    const response = await axios.post('http://localhost:8080/api/v1/upload/server', formData, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data.data[0]
    } else {
      throw new Error('No image URL returned from server')
    }
  } catch (error) {
    console.error('Upload error:', error)
    if (error.response) {
      throw new Error(`Upload failed: ${error.response.data.message || error.response.statusText}`)
    } else if (error.request) {
      throw new Error('Upload failed: No response from server')
    } else {
      throw new Error(`Upload failed: ${error.message}`)
    }
  }
}

export default function BookManager() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [addNewBook, setAddNewBook] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categoryId: "",
    authorId: "",
    language: "",
    minPrice: "",
    maxPrice: "",
    status: "",
    sortDir: "desc",
    page: 0,
    size: 100
  })
  const {showToast} = useToast()

  useEffect(() => {
    fetchBooks()
  }, [filters])

  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', filters.page)
      params.append('size', filters.size)
      params.append('sortDir', filters.sortDir)
      
      if (searchTerm.trim()) params.append('keyword', searchTerm)
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.authorId) params.append('authorId', filters.authorId)
      if (filters.language) params.append('language', filters.language)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

      const bookData = await allBookGet(`/book/all?${params}`)
      setBooks(bookData)
    } catch (error) {
      console.error('Error fetching books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const categoryData = await allCategoryGet()
      setCategories(categoryData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchAuthors = async () => {
    try {
      const authorData = await allAuthorGet()
      setAuthors(authorData)
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  function handleCancelAddNewBook() {
    setAddNewBook(false)
  }

  async function handleSaveBook(bookData) {
    try {
      setLoading(true)
      showToast({type: 'info', message: 'Đang xử lý...'})
      console.log(bookData)
      // Upload ảnh và tạo imageList
      const processedImageList = []
      
      if (bookData.imageList && bookData.imageList.length > 0) {
        for (const image of bookData.imageList) {
          if (image.file) {
            try {
              const uploadedUrl = await uploadImageApi(image.file, token)
              processedImageList.push({
                url: uploadedUrl,
                isDefault: image.isDefault.toString()
              })
            } catch (error) {
              console.error('Error uploading image:', error)
              showToast({type: 'error', message: `Lỗi khi upload ảnh: ${error.message}`})
              return
            }
          } else if (image.url) {
            processedImageList.push({
              url: image.url,
              isDefault: image.isDefault.toString()
            })
          }
        }
      }

      const bookInfo = {
        name: bookData.name,
        description: bookData.description,
        publisher: bookData.publisher,
        publishDate: bookData.publishDate,
        pages: bookData.pages,
        language: bookData.language,
        totalQuantity: bookData.totalQuantity,
        stock: bookData.stock,
        rentalPrice: bookData.rentalPrice,
        depositPrice: bookData.depositPrice,
        status: bookData.status,
        categoryId: bookData.categoryId,
        authorsId: bookData.authorsId,
        imageList: processedImageList
      }
      console.log(bookInfo)
      await createBookPost(bookInfo)
      setAddNewBook(false)
      fetchBooks()
      showToast({type: 'success', message: 'Thêm sách thành công!'})
    } catch (error) {
      console.error('Error saving book:', error)
      showToast({type: 'error', message: 'Có lỗi khi thêm sách!'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý sách</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo tên, nhà xuất bản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.toolActions}>
          <Filter filters={filters} setFilters={setFilters} categories={categories} authors={authors} />
          <button 
            className={styles.addButton} 
            onClick={() => setAddNewBook(true)}
            disabled={loading}
          >
            <Plus size={20} />
            <span>Thêm sách mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : (
          <BookTable 
            books={books} 
            onRefresh={fetchBooks} 
            categories={categories} 
            authors={authors}
            setLoading={setLoading}
          />
        )}
      </div>

      {addNewBook && (
        <div className={styles.bookFormContainer}>
          <BookForm
            book={null}
            onSave={handleSaveBook}
            onCancel={handleCancelAddNewBook}
            categories={categories}
            authors={authors}
            isOpen={addNewBook}
          />
        </div>
      )}
    </div>
  )
}

const Filter = ({ filters, setFilters, categories, authors }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }))
  }

  const handleApplyFilter = () => {
    setIsOpen(false)
  }

  const handleResetFilter = () => {
    setFilters({
      categoryId: "",
      authorId: "",
      language: "",
      minPrice: "",
      maxPrice: "",
      sortDir: "desc",
      page: 0,
      size: 100
    })
    setIsOpen(false)
  }

  return (
    <div className={styles.filterContainer}>
      <button className={styles.filterButton} onClick={() => setIsOpen(!isOpen)}>
        <Funnel size={16} />
        <span>Bộ lọc</span>
        <ChevronDown size={16} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Danh mục</label>
            <select
              className={styles.filterSelect}
              value={filters.categoryId}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tác giả</label>
            <select
              className={styles.filterSelect}
              value={filters.authorId}
              onChange={(e) => handleFilterChange("authorId", e.target.value)}
            >
              <option value="">Tất cả tác giả</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ngôn ngữ</label>
            <select
              className={styles.filterSelect}
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              <option value="">Tất cả ngôn ngữ</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Giá thuê (VNĐ)</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Từ"
                className={styles.priceInput}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Đến"
                className={styles.priceInput}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sắp xếp</label>
            <select
              className={styles.filterSelect}
              value={filters.sortDir}
              onChange={(e) => handleFilterChange("sortDir", e.target.value)}
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.filterReset} onClick={handleResetFilter}>
              Đặt lại
            </button>
            <button className={styles.filterApply} onClick={handleApplyFilter}>
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const BookTable = ({ books, onRefresh, categories, authors, setLoading }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [isEditing, setIsEditing] = useState({ state: false })
  const {showToast} = useToast()

  function handleShowDeleteNoti(bookId, bookName) {
    setShowDeleteNoti({ state: true, id: bookId, name: bookName })
  }

  async function handleDelete(id) {
    try {
      setLoading(true)
      await bookDelete(id)
      showToast({type: 'success', message: 'Đã xóa sách thành công'})
      onRefresh()
    } catch (error) {
      console.error('Error deleting book:', error)
      showToast({type: 'error', message: 'Có lỗi khi xóa sách'})
    } finally {
      setLoading(false)
    }
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  async function handleSaveEditedBook(bookData) {
    try {
      setLoading(true)
      showToast({type: 'info', message: 'Đang xử lý...'})
      const processedImageList = []
      
      if (bookData.imageList && bookData.imageList.length > 0) {
        for (const image of bookData.imageList) {
          if (image.file) {
            try {
              const uploadedUrl = await uploadImageApi(image.file, token)
              processedImageList.push({
                url: uploadedUrl,
                isDefault: image.isDefault.toString()
              })
            } catch (error) {
              console.error('Error uploading image:', error)
              showToast({type: 'error', message: `Lỗi khi upload ảnh: ${error.message}`})
              return
            }
          } else if (image.url) {
            processedImageList.push({
              url: image.url,
              isDefault: image.isDefault.toString()
            })
          }
        }
      }

      const bookInfo = {
        name: bookData.name,
        description: bookData.description,
        publisher: bookData.publisher,
        publishDate: bookData.publishDate,
        pages: bookData.pages,
        language: bookData.language,
        totalQuantity: bookData.totalQuantity,
        stock: bookData.stock,
        rentalPrice: bookData.rentalPrice,
        depositPrice: bookData.depositPrice,
        categoryId: bookData.categoryId,
        authorsId: bookData.authorsId,
        imageList: processedImageList
      }
      console.log(bookInfo)
      await updateBookPut(bookInfo, isEditing.book.id)
      showToast({type: 'success', message: 'Cập nhật sách thành công'})
      onRefresh()
    } catch (error) {
      console.error('Error updating book:', error)
      showToast({type: 'error', message: 'Có lỗi khi cập nhật sách'})
    } finally {
      setLoading(false)
    }
  }

  if (books.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.noResults}>
          <p>Không tìm thấy sách nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Đang thuê</th>
            <th>Giá thuê</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <div className={styles.bookImage}>
                  <img
                    src={book.imageList?.find((img) => img.isDefault === "true")?.url || "/placeholder.svg?height=70&width=50"}
                    alt={book.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=70&width=50"
                    }}
                  />
                </div>
              </td>
              <td>
                <div className={styles.bookInfo}>
                  <h3>{book.name}</h3>
                  <p>{book.description}</p>
                </div>
              </td>
              <td>{book.author?.name || "Không xác định"}</td>
              <td>{book.category?.name || "Không xác định"}</td>
              <td>
                <span className={book.stock > 0 ? styles.inStock : styles.outOfStock}>
                  {book.stock}
                </span>
              </td>
              <td>
                <span className={styles.renting}>{book.quantityRented || 0}</span>
              </td>
              <td className={styles.price}>{(+book.rentalPrice).toLocaleString("vi-VN")} VNĐ</td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.editButton}
                    onClick={() => setIsEditing({state: true, book: book})}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleShowDeleteNoti(book.id, book.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Show notification */}
      {showDeleteNoti.state && (
        <Notification
          handleConfirm={handleConfirmDelete}
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa sách "${showDeleteNoti.name}" không?`}
        />
      )}

      {/* Show edit form */}
      {isEditing.state && (
        <div className={styles.bookFormContainer}>
          <BookForm
            book={isEditing.book}
            onSave={handleSaveEditedBook}
            onCancel={() => setIsEditing({ state: false })}
            categories={categories}
            authors={authors}
            isOpen={isEditing.state}
          />
        </div>
      )}
    </div>
  )
}