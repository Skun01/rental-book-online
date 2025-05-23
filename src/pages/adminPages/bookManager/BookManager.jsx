import styles from './BookManager.module.css';
import { Search, Funnel, ChevronDown, Plus, Trash2,
  Edit} from 'lucide-react';
import { useState } from 'react';
import BookForm from '../../../components/adminComponents/bookForm/BookForm';
export default function BookManager() {
  const [addNewBook, setAddNewBook] = useState(false);

  // xu ly huy add new book
  function handleCancelAddNewBook(){
    setAddNewBook(false);
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý sách</div>
      <div className={styles.bookMangeTool}>
        <div className={`${styles.searchContainer} ${styles.colTool}`}>
          <input type="text" className={styles.searchBar} placeholder='Tìm kiếm theo tên, nhà sản xuất...'/>
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>
        <div className={styles.colTool}>
          <div className={styles.filterContainer}>
            <Filter />
          </div>
          <div className={styles.addBookContainer}>
            <div className={styles.addBookButton}
              onClick={() => setAddNewBook(!addNewBook)}>
              <Plus />
              <span>Thêm sách mới</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bookTableSection}>
        <BookTable/>
      </div>
      <div className={`${styles.bookFormSection} ${addNewBook ? styles.active : ''}`}>
        <BookForm
          book={books[0]}
          onSave={()=>console.log('save')}
          onCancel={handleCancelAddNewBook}
          categories={categories}
          authors={authors}
          isOpen={true}
        />
      </div>
    </div>
  )
}

const Filter = ()=>{
  return (
    <div className={styles.filter}>
      <Funnel />
      <span className={styles.filterTitle}>Bộ lọc</span>
      <ChevronDown />
    </div>
  )
}

const BookTable = ()=>{
  function handleDelete(id){
    console.log('delete book with id: ', id);
  }
  return (
    <div className={styles.booksTable}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Đang cho thuê</th>
            <th>Giá thuê</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book)=>(
            <tr key={book.id}>
              <td>
                <div className={styles.tdImage}>
                  <img src={book.imageList.find((img)=>img.isDefault)?.url || 'auth.jpg'}
                    alt={book.name} />
                </div>
              </td>
              <td>
                <div className={styles.bookTitle}>
                  <h3>{book.name}</h3>
                  <p>{book.description}</p>
                </div>
              </td>
              <td>Thái Văn Trường</td>
              <td>Văn học</td>
              <td className={styles.tableStock}>{book.stock}</td>
              <td className={styles.tableRenting}>10</td>
              <td>{(+book.rentalPrice).toLocaleString('vi-VI')} VNĐ</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(book.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        { isDefault: false, url: "/auth.jpg" }
      ]
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
      imageList: [
        { isDefault: true, url: "/auth.jpg" }
      ]
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
      imageList: [
        { isDefault: true, url: "/auth.jpg" }
      ]
    }
]

const categories  = [
    {id: 1, name: 'Lịch sử'},
    {id: 2, name: 'Văn học'},
    {id: 3, name: 'Khoa học'},
    {id: 4, name: 'Giáo dục'},
    {id: 5, name: 'Kinh tế'},
    {id: 6, name: 'Tâm lý'},
    {id: 7, name: 'Tôn giáo'},
    {id: 8, name: 'Thể thao'},
    {id: 9, name: 'Du lịch'},
    {id: 10, name: 'Nấu ăn'}
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
// "name": "string",
// "description": "string",
// "title": "string",
// "publisher": "string",
// "publish_date": "2025-05-23T09:45:07.137Z",
// "pages": 1073741824,
// "language": "string",
// "totalQuantity": 9007199254740991,
// "stock": 9007199254740991,
// "rentalPrice": 9007199254740991,
// "depositPrice": 9007199254740991,
// "status": "Available",
// "categoryId": 9007199254740991,
// "authorsId": 9007199254740991
// "imageList": [
//   {
//     "isDefault": true,
//     "url": "http://localhost:8080/upload/lichsu1_8e6d8d4d-9f46-4da8-bad8-9b5078c09ec4.jpg"
//   },
//   {
//     "isDefault": false,
//     "url": "http://localhost:8080/upload/lichsu2_aedd4db8-d6ed-48ee-9970-e1eeda422495.jpg"
//   },
//   {
//     "isDefault": false,
//     "url": "http://localhost:8080/upload/lichsu1_8e6d8d4d-9f46-4da8-bad8-9b5078c09ec4.jpg"
//   },
//   {
//     "isDefault": false,
//     "url": "http://localhost:8080/upload/lichsu2_aedd4db8-d6ed-48ee-9970-e1eeda422495.jpg"
//   }
// ],