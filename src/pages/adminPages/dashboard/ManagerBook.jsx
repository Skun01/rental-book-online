import React, { useState, useEffect } from 'react';
import styles from './ManagerBook.module.css';
import { demoBooks, demoCategories } from './fakeData';

function BookManagement() {
  // State for books and categories
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentBookId, setCurrentBookId] = useState(null);
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'categories'
  
  // State for book form
  const [bookForm, setBookForm] = useState({
    name: '',
    description: '',
    publisher: '',
    publication_year: '',
    pages: '',
    language: '',
    total_quantity: '',
    available_quantity: '',
    rental_price: '',
    deposit_price: '',
    status: 'Available',
    category_id: ''
  });
  
  // State for category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Load demo data from fakeData.js
  useEffect(() => {
    setCategories(demoCategories);
    setBooks(demoBooks);
  }, []);

  // Handle book form input changes
  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm({
      ...bookForm,
      [name]: value
    });
  };

  // Handle category form input changes
  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: value
    });
  };

  // Handle book form submission
  const handleBookSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      // Add new book
      const newBook = {
        id: books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1,
        ...bookForm
      };
      setBooks([...books, newBook]);
    } else {
      // Update existing book
      const updatedBooks = books.map(book => 
        book.id === currentBookId ? { ...book, ...bookForm } : book
      );
      setBooks(updatedBooks);
      setFormMode('add');
      setCurrentBookId(null);
    }
    
    // Reset form
    setBookForm({
      name: '',
      description: '',
      publisher: '',
      publication_year: '',
      pages: '',
      language: '',
      total_quantity: '',
      available_quantity: '',
      rental_price: '',
      deposit_price: '',
      status: 'Available',
      category_id: ''
    });
  };

  // Handle category form submission
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      // Add new category
      const newCategory = {
        id: categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) + 1 : 1,
        ...categoryForm
      };
      setCategories([...categories, newCategory]);
    } else {
      // Update existing category
      const updatedCategories = categories.map(category => 
        category.id === currentBookId ? { ...category, ...categoryForm } : category
      );
      setCategories(updatedCategories);
      setFormMode('add');
      setCurrentBookId(null);
    }
    
    // Reset form
    setCategoryForm({
      name: '',
      description: ''
    });
  };

  // Edit book
  const handleEditBook = (book) => {
    setFormMode('edit');
    setCurrentBookId(book.id);
    setBookForm({
      name: book.name,
      description: book.description,
      publisher: book.publisher,
      publication_year: book.publication_year,
      pages: book.pages,
      language: book.language,
      total_quantity: book.total_quantity,
      available_quantity: book.available_quantity,
      rental_price: book.rental_price,
      deposit_price: book.deposit_price,
      status: book.status,
      category_id: book.category_id
    });
  };

  // Edit category
  const handleEditCategory = (category) => {
    setFormMode('edit');
    setCurrentBookId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description
    });
  };

  // Delete book
  const handleDeleteBook = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
    }
  };

  // Delete category
  const handleDeleteCategory = (id) => {
    // Check if any books are using this category
    const booksUsingCategory = books.some(book => book.category_id === id);
    
    if (booksUsingCategory) {
      alert('Không thể xóa thể loại này vì có sách đang sử dụng!');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
    }
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Không xác định';
  };

  return (
    <div className={styles.bookManagementContainer}>
      <div className={styles.tabs}>
        <button 
          className={activeTab === 'books' ? styles.active : ''}
          onClick={() => setActiveTab('books')}
        >
          Quản lý sách
        </button>
        <button 
          className={activeTab === 'categories' ? styles.active : ''}
          onClick={() => setActiveTab('categories')}
        >
          Quản lý thể loại
        </button>
      </div>
      
      {activeTab === 'books' && (
        <div className={styles.booksManagement}>
          <div className={styles.formContainer}>
            <h2>{formMode === 'add' ? 'Thêm sách mới' : 'Cập nhật sách'}</h2>
            <form onSubmit={handleBookSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Tên sách:</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={bookForm.name} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="publisher">Nhà xuất bản:</label>
                  <input 
                    type="text" 
                    id="publisher" 
                    name="publisher" 
                    value={bookForm.publisher} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="publication_year">Năm xuất bản:</label>
                  <input 
                    type="number" 
                    id="publication_year" 
                    name="publication_year" 
                    value={bookForm.publication_year} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="pages">Số trang:</label>
                  <input 
                    type="number" 
                    id="pages" 
                    name="pages" 
                    value={bookForm.pages} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="language">Ngôn ngữ:</label>
                  <input 
                    type="text" 
                    id="language" 
                    name="language" 
                    value={bookForm.language} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="total_quantity">Tổng số:</label>
                  <input 
                    type="number" 
                    id="total_quantity" 
                    name="total_quantity" 
                    value={bookForm.total_quantity} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="available_quantity">Số lượng hiện có:</label>
                  <input 
                    type="number" 
                    id="available_quantity" 
                    name="available_quantity" 
                    value={bookForm.available_quantity} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="rental_price">Giá thuê:</label>
                  <input 
                    type="number" 
                    id="rental_price" 
                    name="rental_price" 
                    value={bookForm.rental_price} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="deposit_price">Giá đặt cọc:</label>
                  <input 
                    type="number" 
                    id="deposit_price" 
                    name="deposit_price" 
                    value={bookForm.deposit_price} 
                    onChange={handleBookFormChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Trạng thái:</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={bookForm.status} 
                    onChange={handleBookFormChange} 
                  >
                    <option value="Available">Có sẵn</option>
                    <option value="Unavailable">Không có sẵn</option>
                    <option value="Maintenance">Bảo trì</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="category_id">Thể loại:</label>
                  <select 
                    id="category_id" 
                    name="category_id" 
                    value={bookForm.category_id} 
                    onChange={handleBookFormChange} 
                    required
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="description">Mô tả:</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={bookForm.description} 
                  onChange={handleBookFormChange} 
                  required 
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit">
                  {formMode === 'add' ? 'Thêm sách' : 'Cập nhật sách'}
                </button>
                {formMode === 'edit' && (
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => {
                      setFormMode('add');
                      setCurrentBookId(null);
                      setBookForm({
                        name: '',
                        description: '',
                        publisher: '',
                        publication_year: '',
                        pages: '',
                        language: '',
                        total_quantity: '',
                        available_quantity: '',
                        rental_price: '',
                        deposit_price: '',
                        status: 'Available',
                        category_id: ''
                      });
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className={styles.listContainer}>
            <h2>Danh sách sách</h2>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sách</th>
                  <th>Nhà xuất bản</th>
                  <th>Năm XB</th>
                  <th>Thể loại</th>
                  <th>SL hiện có</th>
                  <th>Trạng thái</th>
                  <th>Giá thuê</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.name}</td>
                    <td>{book.publisher}</td>
                    <td>{book.publication_year}</td>
                    <td>{getCategoryName(book.category_id)}</td>
                    <td>{book.available_quantity}/{book.total_quantity}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[book.status.toLowerCase()]}`}>
                        {book.status === 'Available' ? 'Có sẵn' : 
                         book.status === 'Unavailable' ? 'Không có sẵn' : 'Bảo trì'}
                      </span>
                    </td>
                    <td>{book.rental_price.toLocaleString()} đ</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEditBook(book)}
                      >
                        Sửa
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'categories' && (
        <div className={styles.categoriesManagement}>
          <div className={styles.formContainer}>
            <h2>{formMode === 'add' ? 'Thêm thể loại mới' : 'Cập nhật thể loại'}</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="category-name">Tên thể loại:</label>
                <input 
                  type="text" 
                  id="category-name" 
                  name="name" 
                  value={categoryForm.name} 
                  onChange={handleCategoryFormChange} 
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="category-description">Mô tả:</label>
                <textarea 
                  id="category-description" 
                  name="description" 
                  value={categoryForm.description} 
                  onChange={handleCategoryFormChange} 
                  required 
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit">
                  {formMode === 'add' ? 'Thêm thể loại' : 'Cập nhật thể loại'}
                </button>
                {formMode === 'edit' && (
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => {
                      setFormMode('add');
                      setCurrentBookId(null);
                      setCategoryForm({
                        name: '',
                        description: ''
                      });
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className={styles.listContainer}>
            <h2>Danh sách thể loại</h2>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên thể loại</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEditCategory(category)}
                      >
                        Sửa
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookManagement;