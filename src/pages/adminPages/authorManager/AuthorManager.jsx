import styles from './AuthorManager.module.css';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import Notification from '../../../components/adminComponents/notification/Notification';

export default function AuthorManager() {
  const [addNewAuthor, setAddNewAuthor] = useState(false);

  function handleCancelAddNewAuthor() {
    setAddNewAuthor(false);
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý tác giả</div>
      <div className={styles.bookMangeTool}>
        <div className={`${styles.searchContainer} ${styles.colTool}`}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo tên tác giả..."
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>
        <div className={styles.colTool}>
          <div className={styles.addBookContainer}>
            <div
              className={styles.addBookButton}
              onClick={() => setAddNewAuthor(!addNewAuthor)}
            >
              <Plus />
              <span>Thêm tác giả mới</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bookTableSection}>
        <AuthorTable />
      </div>

      <div
        className={`${styles.bookFormSection} ${
          addNewAuthor ? styles.active : ''
        }`}
      >
        <AuthorForm
         onSave={()=>console.log('save')}
         onCancel={handleCancelAddNewAuthor}/>
      </div>
    </div>
  );
}

const authors = [
  { id: 1, name: 'Nguyễn Văn A', imageUrl: '/auth.jpg' },
  { id: 2, name: 'Trần Thị B', imageUrl: '/auth.jpg' },
  { id: 3, name: 'Lê Văn C', imageUrl: '/auth.jpg' },
  { id: 4, name: 'Phạm Thị D', imageUrl: '/auth.jpg' },
  { id: 5, name: 'Hoàng Văn E', imageUrl: '/auth.jpg' },
  { id: 6, name: 'Nguyễn Thị F', imageUrl: '/auth.jpg' },
  { id: 7, name: 'Trần Văn G', imageUrl: '/auth.jpg' },
  { id: 8, name: 'Lê Thị H', imageUrl: '/auth.jpg' },
  { id: 9, name: 'Phạm Văn I', imageUrl: '/auth.jpg' },
  { id: 10, name: 'Hoàng Thị J', imageUrl: '/auth.jpg' }
];

const AuthorTable = () => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false });

  function handleShowDeleteNoti(authorId, authorName) {
    setShowDeleteNoti({ state: true, id: authorId, name: authorName });
  }

  function handleDelete(id) {
    console.log('delete author with id: ', id);
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id);
    setShowDeleteNoti({ ...showDeleteNoti, state: false });
  }

  return (
    <div className={styles.booksTable}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã tác giả</th>
            <th>Ảnh</th>
            <th>Tên tác giả</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
                <td>
                    #{author.id}
                </td>
              <td>
                <div className={styles.tdImage}>
                  <img src={author.imageUrl} alt={author.name} />
                </div>
              </td>
              <td>{author.name}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      handleShowDeleteNoti(author.id, author.name)
                    }
                  >
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
          handleCancel={() =>
            setShowDeleteNoti({ ...showDeleteNoti, state: false })
          }
          content={`Bạn có chắc chắn muốn xóa tác giả "${showDeleteNoti.name}" không?`}
        />
      )}
    </div>
  );
};

function AuthorForm({ author, onSave, onCancel, isOpen }) {
    const [name, setName] = useState(author?.name || '');
    const [image, setImage] = useState(author?.imageUrl || null);
    const [preview, setPreview] = useState(author?.imageUrl || null);
  
    function handleImageChange(e) {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  
    function handleSubmit(e) {
      e.preventDefault();
  
      if (!name.trim()) {
        alert('Vui lòng nhập tên tác giả');
        return;
      }
  
      const newAuthor = {
        id: author?.id || Date.now(),
        name,
        imageUrl: preview || '/auth.jpg',
        file: image, // giữ file nếu cần upload
      };
  
      onSave(newAuthor);
    }
  
    return (
      <div className={`${styles.bookFormSection} ${isOpen ? styles.active : ''}`}>
        <form onSubmit={handleSubmit}>
          <h2>{author ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</h2>
  
          <div className={styles.formGroup}>
            <label htmlFor="authorName">Tên tác giả</label>
            <input
              type="text"
              id="authorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tác giả"
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label>Ảnh tác giả</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <div className={styles.previewImage}>
                <img src={preview} alt="Tác giả" />
              </div>
            )}
          </div>
  
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Lưu</button>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    );
  }
