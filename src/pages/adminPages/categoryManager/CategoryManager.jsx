import styles from './CategoryManager.module.css';
import { Search, Plus, Trash2, X,
  Edit} from 'lucide-react';
import { useState } from 'react';
import Notification from '../../../components/adminComponents/notification/Notification';
export default function CategoryManager() {
  const [addNewBook, setAddNewBook] = useState(false)
  // xu ly huy add new book
  function handleCancelAddNewCategory(){
    setAddNewBook(false);
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý danh mục</div>
      <div className={styles.bookMangeTool}>
        <div className={`${styles.searchContainer} ${styles.colTool}`}>
          <input type="text" className={styles.searchBar} placeholder='Tìm kiếm tên danh mục'/>
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>
        <div className={styles.colTool}>
          <div className={styles.addBookContainer}>
            <div className={styles.addBookButton}
              onClick={() => setAddNewBook(!addNewBook)}>
              <Plus />
              <span>Tạo danh mục mới</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bookTableSection}>
        <CategoryTable/>
      </div>
      <div className={`${styles.bookFormSection} ${addNewBook ? styles.active : ''}`}>
        <CategoryForm
         onSave={()=>console.log('save')}
         onCancel={handleCancelAddNewCategory}/>
      </div>
    </div>
  )
}

const CategoryForm = ({ onSave, onCancel }) => {
    const [name, setName] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name.trim()) return;
      onSave({ name });
    };
  
    return (
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Thêm Thể loại</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSections}>
            <div className={styles.formSection}>
              <label className={styles.formLabel} htmlFor="categoryName">
                Tên thể loại
              </label>
              <input
                type="text"
                id="categoryName"
                className={styles.formInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên thể loại"
                required
              />
            </div>
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
    );
  };

const CategoryTable = ()=>{
  const [showDeleteNoti, setShowDeleteNoti] = useState({state: false})
  function handleShowDeleteNoti(id, name){
    setShowDeleteNoti({state: true, id, name})
  }
  function handleDelete(id){
    console.log('delete book with id: ', id);
  }
  function handleConfirmDelete(){
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({...showDeleteNoti, state: false})
  }
  return (
    <div className={styles.booksTable}>
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
          {categories.map((category)=>(
            <tr key={category.id}>
              <td>#{category.id}</td>
                <td>
                    <div className={styles.bookTitle}>
                    <h3>{category.name}</h3>
                    </div>
                </td>
              <td className={styles.tableStock}>{category.bookNumber}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                  </button>
                  <button className={styles.deleteButton} onClick={()=>{handleShowDeleteNoti(category.id, category.name)}}>
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
          handleConfirm={()=>handleConfirmDelete()}
          handleCancel={()=>setShowDeleteNoti({...showDeleteNoti, state: false})}
          content={`Bạn có chắc chắn muốn xóa danh mục "${showDeleteNoti.name}" không?`}/>)}
    </div>
  )
}
const categories  = [
    {id: 1, name: 'Lịch sử', bookNumber: 20},
    {id: 2, name: 'Văn học', bookNumber: 20},
    {id: 3, name: 'Khoa học', bookNumber: 20},
    {id: 4, name: 'Giáo dục', bookNumber: 20},
    {id: 5, name: 'Kinh tế', bookNumber: 20},
    {id: 6, name: 'Tâm lý', bookNumber: 20},
    {id: 7, name: 'Tôn giáo', bookNumber: 20},
    {id: 8, name: 'Thể thao', bookNumber: 20},
    {id: 9, name: 'Du lịch', bookNumber: 20},
    {id: 10, name: 'Nấu ăn', bookNumber: 20}
  ]
const authors = [
{id: 1, name: 'Nguyễn Văn A'},
{id: 2, name: 'Trần Thị B'},
{id: 3, name: 'Lê Văn C'},
{id: 4, name: 'Phạm Thị D'},
{id: 5, name: 'Hoàng Văn E'},
{id: 6, name: 'Nguyễn Thị F'},
{id: 7, name: 'Trần Văn G'},
{id: 8, name: 'Lê Thị H'},
{id: 9, name: 'Phạm Văn I'},
{id: 10, name: 'Hoàng Thị J'}
]