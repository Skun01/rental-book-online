import { useState, useEffect } from "react"
import { X, Save, FileText, BookOpen, DollarSign, ImageIcon, Upload} from "lucide-react"
import styles from "./bookForm.module.css"
import { PiInstagramLogoDuotone } from "react-icons/pi"

const BookForm = ({ book = null, onSave, onCancel, categories, authors, isOpen }) => {
  const [imageList, setImageList] = useState([])
  const [imageListFiles, setImageListFiles] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [mainImageFile, setMainImageFile] = useState(null)
  useEffect(() => {
    
  }, [])
  // xu ly upload main image
  const handleAddMainImage = (e) => {
    const file = e.target.files[0]
    setMainImageFile(file)
    if (file) {
      const image = {
        name: file.name,
        url: URL.createObjectURL(file),
      }
      setMainImage(image)
    }
  }

  // xu ly get sub images
  function handleAddSubImages(e){
    const files = Array.from(e.target.files)
    setImageListFiles(files)
    const images = files.map(file=>{
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      }
    })
    setImageList([...imageList, ...images.slice(0, 3 - imageList.length)])
  }
  // xu ly delete main image
  const handleDeleteImage = (type) => {
    if (type === "main") {
      setMainImage(null)
    }else{
      setImageList((prev) => prev.filter((_, index) => index !== type))
    }
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
    // xu ly upload image
    const formDataImage = new FormData()
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

          {/* Book detail*/}
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

          {/*price and stock*/}
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

          {/*image upload*/}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <ImageIcon size={18} />
              Hình ảnh sách
            </h3>

            <div className={styles.imageUploadArea}>
              {/* main image */}
              <div className={styles.uploadMainImage}>
                <div className={styles.imagePreview}>
                  {mainImage ? ( <>
                    <img src={mainImage.url} alt={mainImage.name}/>
                    <X className={styles.previewImageDelete}
                      onClick={()=>handleDeleteImage('main')}/>
                  </>
                  ): (<div className={styles.emptyImage}>Ảnh chính</div>)}
                  
                </div>
                <div className={styles.uploadButton}>
                  <input type="file" accept="image/*" 
                    className={styles.fileInput} id="MainImage-upload" 
                    onChange={handleAddMainImage}/>
                  <label htmlFor="MainImage-upload" className={styles.uploadButton}>
                    <Upload size={20}/>
                    <span>Chọn ảnh chính</span>
                  </label>
                </div>
              </div>
              {/* sub image */}
              <div className={styles.uploadMainImage}>
                <div className={styles.imagePreviewContainer}>
                  {imageList.length > 0 && imageList.map((image, index)=>(
                    <div className={styles.imagePreview} key={index}>
                      <img src={image.url} alt={image.name}/>
                      <X className={styles.previewImageDelete} onClick={()=>handleDeleteImage(index)}/>
                    </div>
                  ))}
                  {imageList.length < 3 && [0,0,0].slice(0, 3 - imageList.length).map((_, index)=>(
                    <div className={styles.emptyImage} key={index}>
                      Ảnh phụ
                    </div>
                  ))}
                </div>
                <div className={styles.uploadButton}>
                  <input type="file" accept="image/*" 
                    className={styles.fileInput} id="SubImage-upload" 
                    onChange={handleAddSubImages}/>
                  <label htmlFor="SubImage-upload" className={styles.uploadButton}>
                    <Upload size={20}/>
                    <span>chọn các ảnh phụ</span>
                  </label>
                </div>
              </div>
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
