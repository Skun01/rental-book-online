import { useState, useEffect } from "react"
import { X, Save, FileText, BookOpen, DollarSign, ImageIcon, Upload } from "lucide-react"
import styles from "./BookForm.module.css"

const BookForm = ({ book = null, onSave, onCancel, categories, authors, isOpen }) => {
  const [imageList, setImageList] = useState([])
  const [imageListFiles, setImageListFiles] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [mainImageFile, setMainImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    title: "",
    publisher: "",
    publish_date: "",
    pages: "",
    language: "Tiếng Việt",
    totalQuantity: "",
    stock: "",
    rentalPrice: "",
    depositPrice: "",
    status: "Available",
    categoryId: "",
    authorsId: "",
    imageList: [],
  })

  // handle if have books information to edit
  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        publish_date: book.publish_date?.split("T")[0] || "",
      })
      // display images
      if (book.imageList && book.imageList.length > 0) {
        const mainImg = book.imageList.find((img) => img.isDefault)
        if (mainImg) {
          setMainImage({ name: "main", url: mainImg.url })
        }

        const subImages = book.imageList.filter((img) => !img.isDefault).slice(0, 3)
        setImageList(subImages.map((img, index) => ({ name: `sub-${index}`, url: img.url })))
      }
    } else {
      // Reset form to create book
      setFormData({
        name: "",
        description: "",
        title: "",
        publisher: "",
        publish_date: "",
        pages: "",
        language: "Tiếng Việt",
        totalQuantity: "",
        stock: "",
        rentalPrice: "",
        depositPrice: "",
        status: "Available",
        categoryId: "",
        authorsId: "",
        imageList: [],
      })
      setMainImage(null)
      setImageList([])
      setMainImageFile(null)
      setImageListFiles([])
    }
  }, [book, isOpen])

  // Handle main image upload
  const handleAddMainImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMainImageFile(file)
      const image = {
        name: file.name,
        url: URL.createObjectURL(file),
      }
      setMainImage(image)
    }
  }

  // Handle sub images upload
  function handleAddSubImages(e) {
    const files = Array.from(e.target.files)
    const remainingSlots = 3 - imageList.length
    const filesToAdd = files.slice(0, remainingSlots)

    setImageListFiles([...imageListFiles, ...filesToAdd])

    const images = filesToAdd.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setImageList((prev) => [...prev, ...images])
  }

  // Handle image deletion
  const handleDeleteImage = (type) => {
    if (type === "main") {
      setMainImage(null)
      setMainImageFile(null)
    } else {
      setImageList((prev) => prev.filter((_, index) => index !== type))
      setImageListFiles((prev) => prev.filter((_, index) => index !== type))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-set stock to totalQuantity if stock is empty
    if (name === "totalQuantity" && !formData.stock) {
      setFormData((prev) => ({
        ...prev,
        stock: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sách")
      return
    }

    if (!formData.categoryId || !formData.authorsId) {
      alert("Vui lòng chọn danh mục và tác giả")
      return
    }

    if (Number.parseInt(formData.stock) > Number.parseInt(formData.totalQuantity)) {
      alert("Tồn kho không thể lớn hơn tổng số lượng")
      return
    }

    // Prepare image list
    const processedImageList = []

    if (mainImage) {
      processedImageList.push({
        isDefault: true,
        url: mainImage.url,
        file: mainImageFile,
      })
    }

    imageList.forEach((img, index) => {
      processedImageList.push({
        isDefault: false,
        url: img.url,
        file: imageListFiles[index],
      })
    })

    const processedData = {
      ...formData,
      pages: Number.parseInt(formData.pages) || 0,
      totalQuantity: Number.parseInt(formData.totalQuantity) || 0,
      stock: Number.parseInt(formData.stock) || 0,
      rentalPrice: Number.parseInt(formData.rentalPrice) || 0,
      depositPrice: Number.parseInt(formData.depositPrice) || 0,
      categoryId: Number.parseInt(formData.categoryId) || null,
      authorsId: Number.parseInt(formData.authorsId) || null,
      imageList: processedImageList,
    }

    onSave(processedData)
  }

  if (!isOpen) return null

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
          <button onClick={onCancel} className={styles.closeButton}>
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
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                    placeholder="Nhập tên sách"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tiêu đề</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tiêu đề sách"
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
                  placeholder="Nhập mô tả về nội dung sách"
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
                    className={styles.formInput}
                    placeholder="Nhập tên nhà xuất bản"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ngày xuất bản</label>
                  <input
                    type="date"
                    name="publish_date"
                    value={formData.publish_date || ""}
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
                    value={formData.pages || ""}
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
                    value={formData.language || "Tiếng Việt"}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status || "Available"}
                    onChange={handleInputChange}
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

            {/* Price and Stock */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <DollarSign size={18} />
                <span>Số lượng và giá</span>
              </h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tổng số lượng</label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity || ""}
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
                    value={formData.stock || ""}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.totalQuantity || 999999}
                    className={styles.formInput}
                    placeholder="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giá thuê (VNĐ)</label>
                  <input
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice || ""}
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
                    value={formData.depositPrice || ""}
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
                        <img src={mainImage.url || "/placeholder.svg"} alt={mainImage.name} />
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
                        <img src={image.url || "/placeholder.svg"} alt={image.name} />
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
    </div>
  )
}

export default BookForm
