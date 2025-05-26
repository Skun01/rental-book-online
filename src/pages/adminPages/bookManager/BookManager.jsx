import styles from "./BookManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Plus, Trash2, Edit } from "lucide-react"
import { useState } from "react"
import Notification from "../../../components/adminComponents/notification/Notification"
import BookForm from "../../../components/adminComponents/bookForm/BookForm"

export default function BookManager() {
  const [addNewBook, setAddNewBook] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categoryId: "",
    authorId: "",
    sort: "publish_date_desc",
  })

  function handleCancelAddNewBook() {
    setAddNewBook(false)
  }

  function handleSaveBook(bookData) {
    console.log("Saving book:", bookData)
    // Thêm logic lưu sách ở đây
    setAddNewBook(false)
  }

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !filters.categoryId || book.categoryId.toString() === filters.categoryId
    const matchesAuthor = !filters.authorId || book.authorsId.toString() === filters.authorId

    return matchesSearch && matchesCategory && matchesAuthor
  })

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
          <Filter filters={filters} setFilters={setFilters} />
          <button className={styles.addButton} onClick={() => setAddNewBook(true)}>
            <Plus size={20} />
            <span>Thêm sách mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        <BookTable books={filteredBooks} />
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

const Filter = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilter = () => {
    setIsOpen(false)
  }

  const handleResetFilter = () => {
    setFilters({
      categoryId: "",
      authorId: "",
      sort: "publish_date_desc",
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
            <label className={styles.filterLabel}>Sắp xếp</label>
            <select
              className={styles.filterSelect}
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="publish_date_desc">Mới nhất</option>
              <option value="publish_date_asc">Cũ nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
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

const BookTable = ({ books }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })

  function handleShowDeleteNoti(bookId, bookName) {
    setShowDeleteNoti({ state: true, id: bookId, name: bookName })
  }

  function handleDelete(id) {
    console.log("delete book with id: ", id)
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Không xác định"
  }

  const getAuthorName = (authorId) => {
    const author = authors.find((auth) => auth.id === authorId)
    return author ? author.name : "Không xác định"
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
                    src={book.imageList.find((img) => img.isDefault)?.url || "/placeholder.svg?height=70&width=50"}
                    alt={book.name}
                  />
                </div>
              </td>
              <td>
                <div className={styles.bookInfo}>
                  <h3>{book.name}</h3>
                  <p>{book.description}</p>
                </div>
              </td>
              <td>{getAuthorName(book.authorsId)}</td>
              <td>{getCategoryName(book.categoryId)}</td>
              <td>
                <span className={book.stock > 0 ? styles.inStock : styles.outOfStock}>{book.stock}</span>
              </td>
              <td>
                <span className={styles.renting}>{book.totalQuantity - book.stock}</span>
              </td>
              <td className={styles.price}>{(+book.rentalPrice).toLocaleString("vi-VN")} VNĐ</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleShowDeleteNoti(book.id, book.name)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteNoti.state && (
        <Notification
          handleConfirm={handleConfirmDelete}
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa sách "${showDeleteNoti.name}" không?`}
        />
      )}
    </div>
  )
}

const books = [
  {
    id: 1,
    name: "Lập trình React",
    description: "Học React từ cơ bản đến nâng cao với các ví dụ thực tế",
    title: "React Programming Guide",
    publisher: "NXB Thông tin và Truyền thông",
    publish_date: "2024-01-15",
    pages: 456,
    language: "Tiếng Việt",
    totalQuantity: 50,
    stock: 35,
    rentalPrice: 15000,
    depositPrice: 100000,
    status: "Available",
    categoryId: 1,
    authorsId: 1,
    imageList: [
      { isDefault: true, url: "/auth.jpg" },
      { isDefault: false, url: "/auth.jpg" },
    ],
  },
  {
    id: 2,
    name: "JavaScript Nâng cao",
    description: "Khám phá các khái niệm nâng cao trong JavaScript",
    title: "Advanced JavaScript Concepts",
    publisher: "NXB Giáo dục Việt Nam",
    publish_date: "2023-12-20",
    pages: 320,
    language: "Tiếng Việt",
    totalQuantity: 30,
    stock: 20,
    rentalPrice: 20000,
    depositPrice: 120000,
    status: "Available",
    categoryId: 1,
    authorsId: 2,
    imageList: [{ isDefault: true, url: "/auth.jpg" }],
  },
  {
    id: 3,
    name: "Python cho Data Science",
    description: "Ứng dụng Python trong phân tích dữ liệu và machine learning",
    title: "Python for Data Science",
    publisher: "NXB Khoa học và Kỹ thuật",
    publish_date: "2024-03-10",
    pages: 520,
    language: "Tiếng Việt",
    totalQuantity: 25,
    stock: 0,
    rentalPrice: 25000,
    depositPrice: 150000,
    status: "OutOfStock",
    categoryId: 2,
    authorsId: 3,
    imageList: [{ isDefault: true, url: "/auth.jpg" }],
  },
]

const categories = [
  { id: 1, name: "Lịch sử" },
  { id: 2, name: "Văn học" },
  { id: 3, name: "Khoa học" },
  { id: 4, name: "Giáo dục" },
  { id: 5, name: "Kinh tế" },
  { id: 6, name: "Tâm lý" },
  { id: 7, name: "Tôn giáo" },
  { id: 8, name: "Thể thao" },
  { id: 9, name: "Du lịch" },
  { id: 10, name: "Nấu ăn" },
]

const authors = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
  { id: 5, name: "Hoàng Văn E" },
  { id: 6, name: "Nguyễn Thị F" },
  { id: 7, name: "Trần Văn G" },
  { id: 8, name: "Lê Thị H" },
  { id: 9, name: "Phạm Văn I" },
  { id: 10, name: "Hoàng Thị J" },
]
