import { useState, useEffect } from "react"
import { X, Save, FileText, BookOpen, DollarSign, ImageIcon, Upload } from "lucide-react"
import styles from "./BookForm.module.css"
import { useToast } from "../../../contexts/ToastContext"

const BookForm = ({ book = null, onSave, onCancel, categories, authors, isOpen }) => {
  const [imageList, setImageList] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const {showToast} = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    publisher: "",
    publishDate: "",
    pages: "",
    language: "Tiếng Việt",
    totalQuantity: "",
    stock: "",
    rentalPrice: "",
    depositPrice: "",
    status: "Active",
    categoryId: "",
    authorsId: "",
    imageList: [],
  })

  useEffect(() => {
    if (book) {
      setFormData({
        name: book.name || "",
        description: book.description || "",
        publisher: book.publisher || "",
        publishDate: book.publishDate ? book.publishDate.split("T")[0] : "",
        pages: book.pages || "",
        language: book.language || "Tiếng Việt",
        totalQuantity: book.totalQuantity || "",
        stock: book.stock || "",
        rentalPrice: book.rentalPrice || "",
        depositPrice: book.depositPrice || "",
        status: book.status || "Active",
        categoryId: book.category?.id || "",
        authorsId: book.author?.id || "",
        imageList: [],
      })

      // Display existing images
      if (book.imageList && book.imageList.length > 0) {
        const processedImages = []
        
        book.imageList.forEach((img) => {
          processedImages.push({
            url: img.url,
            isDefault: img.isDefault === "true",
            file: null, // Existing images don't have file
            name: img.isDefault === "true" ? "main" : `sub-${processedImages.length}`
          })
        })

        const mainImg = processedImages.find(img => img.isDefault)
        const subImages = processedImages.filter(img => !img.isDefault).slice(0, 3)
        
        if (mainImg) {
          setMainImage(mainImg)
        }
        setImageList(subImages)
      }
    } else {
      // Reset form for new book
      setFormData({
        name: "",
        description: "",
        publisher: "",
        publishDate: "",
        pages: "",
        language: "Tiếng Việt",
        totalQuantity: "",
        stock: "",
        rentalPrice: "",
        depositPrice: "",
        status: "Active",
        categoryId: "",
        authorsId: "",
        imageList: [],
      })
      setMainImage(null)
      setImageList([])
    }
  }, [book, isOpen])

  // Handle main image upload
  const handleAddMainImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast({type: 'error', message: 'Vui lòng chọn file ảnh!'})
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast({type: 'error', message: 'Kích thước file không được vượt quá 5MB!'})
        return
      }

      const image = {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
        isDefault: true
      }
      setMainImage(image)
    }
  }

  // Handle sub images upload
  const handleAddSubImages = (e) => {
    const files = Array.from(e.target.files)
    const remainingSlots = 3 - imageList.length
    const filesToAdd = files.slice(0, remainingSlots)

    // Validate each file
    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        showToast({type: 'error', message: 'Vui lòng chỉ chọn file ảnh!'})
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast({type: 'error', message: 'Kích thước file không được vượt quá 5MB!'})
        return
      }
    }

    const newImages = filesToAdd.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
      isDefault: false
    }))

    setImageList((prev) => [...prev, ...newImages])
  }

  // Handle delete image
  const handleDeleteImage = (type) => {
    if (type === "main") {
      // Clean up URL if it's a blob
      if (mainImage && mainImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(mainImage.url)
      }
      setMainImage(null)
      
      // Reset file input
      const fileInput = document.getElementById('MainImage-upload')
      if (fileInput) {
        fileInput.value = ''
      }
    } else {
      setImageList((prev) => {
        const imageToDelete = prev[type]
        if (imageToDelete && imageToDelete.url.startsWith('blob:')) {
          URL.revokeObjectURL(imageToDelete.url)
        }
        return prev.filter((_, index) => index !== type)
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "totalQuantity" && !formData.stock) {
      setFormData((prev) => ({
        ...prev,
        stock: value,
      }))
    }
  }

  // Handle submit to add or edit books
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      showToast({type: 'error', message: 'Vui lòng nhập tên sách!'})
      return
    }

    if (!formData.categoryId || !formData.authorsId) {
      showToast({type: 'error', message: 'Vui lòng chọn danh mục và tác giả!'})
      return
    }

    if (Number.parseInt(formData.stock) > Number.parseInt(formData.totalQuantity)) {
      showToast({type: 'error', message: 'Tồn kho không thể lớn hơn tổng số lượng!'})
      return
    }

    try {
      setUploading(true)

      // Prepare image list
      const processedImageList = []
      
      // Add main image
      if (mainImage) {
        processedImageList.push({
          isDefault: true,
          url: mainImage.url,
          file: mainImage.file
        })
      }

      // Add sub images
      imageList.forEach((img) => {
        processedImageList.push({
          isDefault: false,
          url: img.url,
          file: img.file
        })
      })

      const processedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        publisher: formData.publisher.trim(),
        publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : null,
        pages: Number.parseInt(formData.pages) || 0,
        language: formData.language,
        totalQuantity: Number.parseInt(formData.totalQuantity) || 0,
        stock: Number.parseInt(formData.stock) || 0,
        rentalPrice: Number.parseFloat(formData.rentalPrice) || 0,
        depositPrice: Number.parseFloat(formData.depositPrice) || 0,
        status: formData.status,
        categoryId: Number.parseInt(formData.categoryId),
        authorsId: Number.parseInt(formData.authorsId),
        imageList: processedImageList,
      }
      console.log(processedData)
      await onSave(processedData)
      
      // Clean up blob URLs
      processedImageList.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url)
        }
      })
      
    } catch (error) {
      console.error("Error in form submission:", error)
      showToast({type: 'error', message: 'Có lỗi xảy ra khi lưu sách!'})
    } finally {
      setUploading(false)
    }
  }

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mainImage && mainImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(mainImage.url)
      }
      imageList.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url)
        }
      })
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
          <button onClick={onCancel} className={styles.closeButton} disabled={uploading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSections}>

            {/* Basic Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FileText size={18} />
                Thông tin cơ bản
              </h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên sách *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                    placeholder="Nhập tên sách"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={styles.formTextarea}
                  placeholder="Nhập mô tả về nội dung sách"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nhà xuất bản</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tên nhà xuất bản"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngày xuất bản</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* Book Details */}
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
                    value={formData.pages}
                    onChange={handleInputChange}
                    min="1"
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngôn ngữ</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Danh mục *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories && categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tác giả *</label>
                  <select
                    name="authorsId"
                    value={formData.authorsId}
                    onChange={handleInputChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Chọn tác giả</option>
                    {authors && authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quantity and Price */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <DollarSign size={18} />
                Số lượng và giá
              </h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tổng số lượng</label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tồn kho</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.totalQuantity || 999999}
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giá thuê (VNĐ)</label>
                  <input
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleInputChange}
                    min="0"
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tiền cọc (VNĐ)</label>
                  <input
                    type="number"
                    name="depositPrice"
                    value={formData.depositPrice}
                    onChange={handleInputChange}
                    min="0"
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <ImageIcon size={18} />
                Hình ảnh sách
              </h3>

              <div className={styles.imageUploadArea}>
                {/* Main Image */}
                <div className={styles.uploadMainImage}>
                  <div className={styles.imagePreview}>
                    {mainImage ? (
                      <>
                        <img src={mainImage.url} alt={mainImage.name} />
                        <X className={styles.previewImageDelete} onClick={() => handleDeleteImage("main")} />
                      </>
                    ) : (
                      <div className={styles.emptyImage}>Ảnh chính</div>
                    )}
                  </div>
                  <div className={styles.uploadButtonContainer}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      id="MainImage-upload"
                      onChange={handleAddMainImage}
                    />
                    <label htmlFor="MainImage-upload" className={styles.uploadButton}>
                      <Upload size={16} />
                      <span>Chọn ảnh chính</span>
                    </label>
                  </div>
                </div>

                {/* Sub Images */}
                <div className={styles.uploadSubImage}>
                  <div className={styles.imagePreviewContainer}>
                    {imageList.map((image, index) => (
                      <div className={styles.imagePreview} key={index}>
                        <img src={image.url} alt={image.name} />
                        <X className={styles.previewImageDelete} onClick={() => handleDeleteImage(index)} />
                      </div>
                    ))}
                    {imageList.length < 3 &&
                      Array(3 - imageList.length)
                        .fill(0)
                        .map((_, index) => (
                          <div className={styles.emptyImage} key={`empty-${index}`}>
                            Ảnh phụ
                          </div>
                        ))}
                  </div>
                  <div className={styles.uploadButtonContainer}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className={styles.fileInput}
                      id="SubImage-upload"
                      onChange={handleAddSubImages}
                      disabled={imageList.length >= 3}
                    />
                    <label
                      htmlFor="SubImage-upload"
                      className={`${styles.uploadButton} ${imageList.length >= 3 ? styles.disabled : ""}`}
                    >
                      <Upload size={16} />
                      <span>Chọn ảnh phụ ({imageList.length}/3)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={uploading}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton} disabled={uploading}>
              <Save size={16} />
              {uploading ? "Đang xử lý..." : (book ? "Cập nhật" : "Thêm sách")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookForm