import styles from "./CategoryManager.module.css"
import { Search, Plus, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react"
import { useEffect, useState, useMemo, useCallback } from "react"
import Notification from "../../../components/adminComponents/notification/Notification"
import {allCategoryGet, updateCategoryPut, createCategoryPost, 
  deleteCategoryPut} from '../../../api/categoryApi'
import {booksByCategoryIdGet} from '../../../api/bookApi'
import { useToast } from "../../../contexts/ToastContext"

const token = localStorage.getItem('token')

export default function CategoryManager() {
  const [addNewCategory, setAddNewCategory] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState('none') // 'none', 'asc', 'desc'
  const [loading, setLoading] = useState(false)
  const {showToast} = useToast()

  // Fetch categories data only on initial load
  useEffect(() => {
    async function getData() {
      setLoading(true)
      try {
        const categoryData = await allCategoryGet()
        // Fetch book count for each category
        const categoriesWithBookCount = await Promise.all(
          categoryData.map(async (category) => {
            try {
              const booksList = await booksByCategoryIdGet(category.id)
              return { ...category, bookNumber: booksList.length }
            } catch (err) {
              console.error(`Error fetching books for category ${category.id}:`, err)
              return { ...category, bookNumber: 0 }
            }
          })
        )
        setCategories(categoriesWithBookCount)
      } catch (err) {
        console.error(`Can't get categories:`, err)
        showToast({type: 'error', message: 'Có lỗi khi tải danh sách danh mục'})
      } finally {
        setLoading(false)
      }
    }    
    getData()
  }, [showToast])

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => a.bookNumber - b.bookNumber)
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.bookNumber - a.bookNumber)
    }

    return filtered
  }, [categories, searchTerm, sortOrder])

  // Optimized state update functions
  const updateCategoryInState = useCallback((updatedCategory) => {
    setCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    )
  }, [])

  const removeCategoryFromState = useCallback((categoryId) => {
    setCategories(prevCategories => 
      prevCategories.filter(cat => cat.id !== categoryId)
    )
  }, [])

  const addCategoryToState = useCallback((newCategory) => {
    setCategories(prevCategories => [...prevCategories, newCategory])
  }, [])

  // Handlers
  const handleCancelAddNewCategory = useCallback(() => {
    setAddNewCategory(false)
  }, [])

  const handleSaveCategory = useCallback(async (categoryData) => {
    try {
      const response = await createCategoryPost(categoryData.name, token)
      
      const newCategory = {
        id: response?.id || Date.now(),
        name: categoryData.name,
        bookNumber: 0
      }
      
      addCategoryToState(newCategory)
      showToast({type: 'success', message: 'Tạo danh mục thành công!'})
      setAddNewCategory(false)
    } catch (err) {
      showToast({type: 'error', message: 'Có lỗi khi tạo danh mục'})
      console.error(`Can't create category:`, err)
    }
  }, [addCategoryToState, showToast])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleSortToggle = useCallback(() => {
    setSortOrder(prevOrder => {
      if (prevOrder === 'none' || prevOrder === 'desc') return 'asc'
      return 'desc'
    })
  }, [])

  const getSortIcon = useCallback(() => {
    if (sortOrder === 'asc') return <ChevronUp size={16} />
    if (sortOrder === 'desc') return <ChevronDown size={16} />
    return null
  }, [sortOrder])

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý danh mục</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="Tìm kiếm tên danh mục..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.addCategoryContainer}>
          <button 
            className={styles.addButton} 
            onClick={() => setAddNewCategory(true)}
            disabled={loading}
          >
            <Plus size={20} />
            <span>Tạo danh mục mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : (
          <CategoryTable 
            categories={filteredAndSortedCategories}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            getSortIcon={getSortIcon}
            onUpdateCategory={updateCategoryInState}
            onRemoveCategory={removeCategoryFromState}
          />
        )}
      </div>

      {addNewCategory && (
        <CategoryForm 
          onSave={handleSaveCategory} 
          onCancel={handleCancelAddNewCategory} 
        />
      )}
    </div>
  )
}

const CategoryTable = ({ categories, onSortToggle, getSortIcon, onUpdateCategory, onRemoveCategory }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [isEditing, setIsEditing] = useState({ state: false })
  const { showToast } = useToast()

  const handleShowDeleteNoti = useCallback((id, name) => {
    setShowDeleteNoti({ state: true, id, name })
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteCategoryPut(id, token)
      onRemoveCategory(id) // Update state directly instead of refetching
      showToast({type: 'success', message: 'Xóa danh mục thành công!'})
    } catch (err) {
      showToast({type: 'error', message: 'Có lỗi khi xóa danh mục'})
      console.error(`Can't delete category:`, err)
    }
  }, [onRemoveCategory, showToast])

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ state: false })
  }, [handleDelete, showDeleteNoti.id])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteNoti({ state: false })
  }, [])

  const handleSaveEditedCategory = useCallback(async (categoryData) => {
    try {
      await updateCategoryPut(categoryData.id, categoryData.name, token)
      
      // Update state directly instead of refetching
      onUpdateCategory({
        ...categoryData,
        name: categoryData.name
      })
      
      setIsEditing({ state: false })
      showToast({type: 'success', message: 'Đã cập nhật danh mục thành công!'})
    } catch (err) {
      showToast({type: 'error', message: 'Có lỗi khi cập nhật danh mục!'})
      console.error(`Can't update category:`, err)
    }
  }, [onUpdateCategory, showToast])

  const handleEditCategory = useCallback((category) => {
    setIsEditing({state: true, category: category})
  }, [])

  const handleCancelEdit = useCallback(() => {
    setIsEditing({ state: false })
  }, [])

  if (categories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Không tìm thấy danh mục nào</p>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã danh mục</th>
            <th>Tên danh mục</th>
            <th 
              className={styles.sortableHeader}
              onClick={onSortToggle}
              title="Click để sắp xếp"
            >
              <div className={styles.sortableHeaderContent}>
                <span>Số lượng sách</span>
                {getSortIcon()}
              </div>
            </th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>#{category.id}</td>
              <td>
                <div className={styles.categoryName}>
                  <h3>{category.name}</h3>
                </div>
              </td>
              <td>
                <span className={styles.bookCount}>{category.bookNumber} cuốn</span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditCategory(category)}
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleShowDeleteNoti(category.id, category.name)}
                    title="Xóa"
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
          handleCancel={handleCancelDelete}
          content={`Bạn có chắc chắn muốn xóa danh mục "${showDeleteNoti.name}" không?`}
        />
      )}

      {/* Show editing form */}
      {isEditing.state && (
        <CategoryForm
          onSave={handleSaveEditedCategory}
          onCancel={handleCancelEdit}
          category={isEditing.category}
        />
      )}
    </div>
  )
}

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (category) {
      setName(category.name)
    }
  }, [category])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      showToast({type: 'error', message: 'Vui lòng nhập tên danh mục'})
      return
    }

    setIsSubmitting(true)
    try {
      const categoryData = {
        id: category ? category.id : '',
        name: name.trim(),
        bookNumber: category ? category.bookNumber : 0,
      }

      await onSave(categoryData)
      
      // Reset form if creating new category
      if (!category) {
        setName("")
      }
    } catch (err) {
      console.error('Error saving category:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [name, category, onSave, showToast])

  const handleNameChange = useCallback((e) => {
    setName(e.target.value)
  }, [])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }, [onCancel])

  return (
    <div className={styles.formOverlay} onClick={handleOverlayClick}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>

          <div className={styles.formGroup}>
            <label htmlFor="categoryName" className={styles.formLabel}>
              Tên danh mục
            </label>
            <input
              type="text"
              id="categoryName"
              className={styles.formInput}
              value={name}
              onChange={handleNameChange}
              placeholder="Nhập tên danh mục"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}