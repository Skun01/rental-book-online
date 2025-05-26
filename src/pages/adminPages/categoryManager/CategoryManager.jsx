import styles from "./CategoryManager.module.css"
import { Search, Plus, Trash2, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import Notification from "../../../components/adminComponents/notification/Notification"

export default function CategoryManager() {
  const [addNewCategory, setAddNewCategory] = useState(false)

  function handleCancelAddNewCategory() {
    setAddNewCategory(false)
  }

  function handleSaveCategory(categoryData) {
    console.log("Saving category:", categoryData)
    // Thêm logic lưu danh mục ở đây
    setAddNewCategory(false)
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý danh mục</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input type="text" className={styles.searchBar} placeholder="Tìm kiếm tên danh mục..." />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.addCategoryContainer}>
          <button className={styles.addButton} onClick={() => setAddNewCategory(true)}>
            <Plus size={20} />
            <span>Tạo danh mục mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        <CategoryTable />
      </div>

      {addNewCategory && <CategoryForm onSave={handleSaveCategory} onCancel={handleCancelAddNewCategory} />}
    </div>
  )
}

const categories = [
  { id: 1, name: "Lịch sử", bookNumber: 20 },
  { id: 2, name: "Văn học", bookNumber: 35 },
  { id: 3, name: "Khoa học", bookNumber: 28 },
  { id: 4, name: "Giáo dục", bookNumber: 42 },
  { id: 5, name: "Kinh tế", bookNumber: 15 },
  { id: 6, name: "Tâm lý", bookNumber: 23 },
  { id: 7, name: "Tôn giáo", bookNumber: 12 },
  { id: 8, name: "Thể thao", bookNumber: 18 },
  { id: 9, name: "Du lịch", bookNumber: 25 },
  { id: 10, name: "Nấu ăn", bookNumber: 30 },
]

const CategoryTable = () => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [isEditing, setIsEditing] = useState({ state: false })
  function handleShowDeleteNoti(id, name) {
    setShowDeleteNoti({ state: true, id, name })
  }

  function handleDelete(id) {
    console.log("delete category with id: ", id)
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  function handleSaveEditedCategory(categoryData) {
    console.log("Saving edited category:", categoryData)
    setIsEditing({ state: false })
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã danh mục</th>
            <th>Tên danh mục</th>
            <th>Số lượng sách</th>
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
                  <button className={styles.editButton}>
                    <Edit size={16} 
                      onClick={()=>setIsEditing({state: true, category: category})}/>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleShowDeleteNoti(category.id, category.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* show notification */}
      {showDeleteNoti.state && (
        <Notification
          handleConfirm={handleConfirmDelete}
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa danh mục "${showDeleteNoti.name}" không?`}
        />
      )}

      {/* show editing form */}
      {isEditing.state && (
        <CategoryForm
          onSave={(categoryData) => handleSaveEditedCategory(categoryData)}
          onCancel={() => setIsEditing({ state: false })}
          category={isEditing.category}
        />
      )}
    </div>
  )
}

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState("")

  // if edit category:
  useEffect(()=>{
    if(category){
      setName(category.name)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục")
      return
    }

    const newCategory = {
      id: Date.now(),
      name: name.trim(),
      bookNumber: 0,
    }

    onSave(newCategory)
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{category ? `Chỉnh sửa danh mục` : 'Thêm danh mục mới'}</h2>

          <div className={styles.formGroup}>
            <label htmlFor="categoryName" className={styles.formLabel}>
              Tên danh mục
            </label>
            <input
              type="text"
              id="categoryName"
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục"
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
