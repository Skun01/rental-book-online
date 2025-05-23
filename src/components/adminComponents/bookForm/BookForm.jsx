import { useState, useEffect } from "react"
import { X, Save, FileText, BookOpen, DollarSign, ImageIcon, Upload } from "lucide-react"
import styles from "./bookForm.module.css"

const BookForm = ({ book = null, onSave, onCancel, categories, authors, isOpen }) => {
  const [imageList, setImageList] = useState([])
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files)
    const images = files.map((file)=>({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
  }
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    title: "",
    publisher: "",
    publish_date: "",
    pages: "",
    language: "",
    totalQuantity: "",
    stock: "",
    rentalPrice: "",
    depositPrice: "",
    status: "Available",
    categoryId: "",
    authorsId: "",
    imageList: [],
  })

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        publish_date: book.publish_date?.split("T")[0] || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        title: "",
        publisher: "",
        publish_date: "",
        pages: "",
        language: "",
        totalQuantity: "",
        stock: "",
        rentalPrice: "",
        depositPrice: "",
        status: "Available",
        categoryId: "",
        authorsId: "",
        imageList: [],
      })
    }
  }, [book, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const processedData = {
      ...formData,
      pages: Number.parseInt(formData.pages) || 0,
      totalQuantity: Number.parseInt(formData.totalQuantity) || 0,
      stock: Number.parseInt(formData.stock) || 0,
      rentalPrice: Number.parseInt(formData.rentalPrice) || 0,
      depositPrice: Number.parseInt(formData.depositPrice) || 0,
      categoryId: Number.parseInt(formData.categoryId) || null,
      authorsId: Number.parseInt(formData.authorsId) || null,
    }

    onSave(processedData)
  }

  if (!isOpen) return null

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
        <button onClick={onCancel} className={styles.closeButton}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSections}>
          {/* Basic Information*/}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FileText size={18} />
              Thông tin cơ bản
            </h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên sách</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mô tả</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={4}
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nhà xuất bản</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ngày xuất bản</label>
                <input
                  type="date"
                  name="publish_date"
                  value={formData.publish_date || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          {/* Book Details*/}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <BookOpen size={18} />
              Chi tiết sách
            </h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số trang</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages || ""}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ngôn ngữ</label>
                <select
                  name="language"
                  value={formData.language || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Chọn ngôn ngữ</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="English">English</option>
                  <option value="中文">中文</option>
                  <option value="日本語">日本語</option>
                  <option value="한국어">한국어</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status || "Available"}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="Available">Có sẵn</option>
                  <option value="OutOfStock">Hết hàng</option>
                  <option value="Discontinued">Ngừng kinh doanh</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Danh mục</label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tác giả</label>
                <select
                  name="authorsId"
                  value={formData.authorsId || ""}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Chọn tác giả</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory & Pricing*/}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <DollarSign size={18}/>
              <span>Thông tin hàng và giá cả</span>
            </h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tổng số lượng</label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tồn kho</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max={formData.totalQuantity || 999999}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Giá thuê (VNĐ)</label>
                <input
                  type="number"
                  name="rentalPrice"
                  value={formData.rentalPrice || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tiền cọc (VNĐ)</label>
                <input
                  type="number"
                  name="depositPrice"
                  value={formData.depositPrice || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section*/}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <ImageIcon size={18} />
              Hình ảnh sách
            </h3>

            <div className={styles.imageUploadArea}>
              <Upload size={48} className={styles.uploadIcon} />
              <p className={styles.uploadText}>Click chọn ảnh thêm vào</p>
              <input type="file" multiple accept="image/*" 
                className={styles.fileInput} id="image-upload" 
                onChange={handleAddImage}/>
              <label htmlFor="image-upload" className={styles.uploadButton}>
                Chọn ảnh
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions*/}
        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Hủy
          </button>
          <button type="submit" className={styles.saveButton}>
            <Save size={16} />
            {book ? "Cập nhật" : "Thêm sách"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookForm
