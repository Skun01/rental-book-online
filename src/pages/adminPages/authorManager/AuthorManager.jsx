import styles from "./AuthorManager.module.css"
import { Search, Plus, Trash2, Edit, Upload, X } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import Notification from "../../../components/adminComponents/notification/Notification"
import {allAuthorGet, createAuthorPost, deleteAuthorPut, updateAuthorPut} from '../../../api/authorApi'
import { useToast } from "../../../contexts/ToastContext"

const token = localStorage.getItem('token')

// API function để upload ảnh
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

export default function AuthorManager() {
  const [addNewAuthor, setAddNewAuthor] = useState(false)
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAuthors, setFilteredAuthors] = useState([])
  const {showToast} = useToast()
  
  useEffect(() => {
    fetchAuthors()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAuthors(authors)
    } else {
      setFilteredAuthors(
        authors.filter(author => 
          author.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [authors, searchTerm])

  function handleCancelAddNewAuthor() {
    setAddNewAuthor(false)
  }

  async function handleSaveAuthor(authorData) {
    try {
      setLoading(true)
      const newAuthor = {
        name: authorData.name,
        avatar: authorData.avatar,
        description: authorData.description
      }

      await createAuthorPost(newAuthor, token)
      await fetchAuthors()
      setAddNewAuthor(false)
      showToast({type: 'success', message: 'Thêm tác giả thành công!'})
    } catch (error) {
      console.error("Error creating author:", error)
      showToast({type: 'error', message: 'Lỗi khi thêm tác giả!'})
    } finally {
      setLoading(false)
    }
  }

  async function fetchAuthors(){
      try {
        setLoading(true)
        const authorsData = await allAuthorGet()
        setAuthors(authorsData)
      } catch (error) {
        console.error("Error fetching authors:", error)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý tác giả</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="Tìm kiếm theo tên tác giả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.addAuthorContainer}>
          <button 
            className={styles.addButton} 
            onClick={() => setAddNewAuthor(true)}
            disabled={loading}
          >
            <Plus size={20} />
            <span>Thêm tác giả mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Đang tải...
          </div>
        ) : (
          <AuthorTable 
            authors={filteredAuthors} 
            onRefresh={fetchAuthors}
            setLoading={setLoading}
          />
        )}
      </div>

      {addNewAuthor && (
        <AuthorForm 
          onSave={handleSaveAuthor} 
          onCancel={handleCancelAddNewAuthor} 
        />
      )}
    </div>
  )
}

const AuthorTable = ({ authors, onRefresh, setLoading }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [isEditing, setIsEditing] = useState({ state: false })
  const {showToast} = useToast()
  
  function handleShowDeleteNoti(authorId, authorName) {
    setShowDeleteNoti({ state: true, id: authorId, name: authorName })
  }

  async function handleDelete(id) {
    try {
      setLoading(true)
      await deleteAuthorPut(id, token)
      await onRefresh()
      showToast({type: 'success', message: 'Xóa tác giả thành công!'})
    } catch (error) {
      console.error("Error deleting author:", error)
      showToast({type: 'error', message: 'Lỗi khi xóa tác giả!'})
    } finally {
      setLoading(false)
    }
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  function handleEditAuthor(author) {
    setIsEditing({ state: true, author: author })
  }

  async function handleSaveEditedAuthor(authorData) {
    try {
      setLoading(true)
      const editedAuthor = {
        id: authorData.id,
        name: authorData.name,
        avatar: authorData.avatar,
        description: authorData.description
      }
      await updateAuthorPut(authorData.id, editedAuthor, token)
      await onRefresh()
      setIsEditing({ state: false })
      showToast({type: 'success', message: 'Cập nhật tác giả thành công!'})
    } catch (error) {
      console.error("Error updating author:", error)
      showToast({type: 'error', message: 'Lỗi khi cập nhật tác giả!'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã tác giả</th>
            <th>Ảnh</th>
            <th>Tên tác giả</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>#{author.id}</td>
              <td>
                <div className={styles.authorImage}>
                  <img 
                    src={author.avatar || "/placeholder.svg"} 
                    alt={author.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </td>
              <td>{author.name}</td>
              <td>
                <span className={styles.description}>
                  {author.description || "Chưa có mô tả"}
                </span>
              </td>
              <td>
                {author.createAt ? new Date(author.createAt).toLocaleDateString('vi-VN') : "N/A"}
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditAuthor(author)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleShowDeleteNoti(author.id, author.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {authors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Không có tác giả nào
        </div>
      )}
      
      {/* show delete notification */}
      {showDeleteNoti.state && (
        <Notification
          handleConfirm={handleConfirmDelete}
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa tác giả "${showDeleteNoti.name}" không?`}
        />
      )}

      {/* show edit form */}
      {isEditing.state && (
        <AuthorForm
          author={isEditing.author}
          onSave={handleSaveEditedAuthor}
          onCancel={() => setIsEditing({ state: false })}
        />
      )}
    </div>
  )
}

function AuthorForm({ author, onSave, onCancel }) {
  const [name, setName] = useState(author?.name || "")
  const [avatar, setAvatar] = useState(author?.avatar || "")
  const [description, setDescription] = useState(author?.description || "")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(author?.avatar || "")
  const [uploading, setUploading] = useState(false)
  const {showToast} = useToast()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast({type: 'error', message: 'Vui lòng chọn file ảnh!'})
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast({type: 'error', message: 'Kích thước file không được vượt quá 5MB!'})
        return
      }

      setSelectedFile(file)
    
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(author?.avatar || "")
    const fileInput = document.getElementById('authorAvatar')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) {
      showToast({type: 'error', message: 'Vui lòng nhập tên tác giả!'})
      return
    }

    try {
      setUploading(true)
      let avatarUrl = avatar
      if (selectedFile) {
        try {
          showToast({type: 'info', message: 'Đang upload ảnh...'})
          avatarUrl = await uploadImageApi(selectedFile, token)
          showToast({type: 'success', message: 'Upload ảnh thành công!'})
        } catch (error) {
          console.error("Error uploading image:", error)
          showToast({type: 'error', message: error.message || 'Lỗi khi upload ảnh!'})
          return
        }
      }

      const authorData = {
        id: author?.id,
        name: name.trim(),
        avatar: avatarUrl,
        description: description.trim()
      }

      onSave(authorData)
    } catch (error) {
      console.error("Error in form submission:", error)
      showToast({type: 'error', message: 'Có lỗi xảy ra!'})
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>
            {author ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}
          </h2>

          <div className={styles.formGroup}>
            <label htmlFor="authorName" className={styles.formLabel}>
              Tên tác giả *
            </label>
            <input
              type="text"
              id="authorName"
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tác giả"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="authorAvatar" className={styles.formLabel}>
              Ảnh tác giả
            </label>
            
            <div className={styles.imageUploadContainer}>
              <input
                type="file"
                id="authorAvatar"
                className={styles.fileInput}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              <label htmlFor="authorAvatar" className={styles.uploadButton}>
                <Upload size={20} />
                <span>Chọn ảnh</span>
              </label>

              {selectedFile && (
                <div className={styles.selectedFileInfo}>
                  <span className={styles.fileName}>{selectedFile.name}</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className={styles.removeFileButton}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className={styles.imagePreview}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="authorDescription" className={styles.formLabel}>
              Mô tả
            </label>
            <textarea
              id="authorDescription"
              className={styles.formInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả về tác giả"
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onCancel}
              disabled={uploading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={uploading}
            >
              {uploading ? 'Đang xử lý...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}