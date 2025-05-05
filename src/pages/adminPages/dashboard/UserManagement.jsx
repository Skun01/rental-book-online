import React, { useState, useEffect } from 'react';
import styles from './UserManagement.module.css';

// Demo data cho roles
const demoRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Librarian' },
  { id: 3, name: 'Member' }
];

// Demo data cho users
const demoUsers = [
  {
    id: 1,
    create_at: '2025-01-15T08:30:00',
    create_by: 'admin',
    update_at: '2025-04-20T14:15:00',
    update_by: 'admin',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    full_name: 'John Doe',
    gender: 'Male',
    age: 28,
    phone: '0901234567',
    refresh_token: null,
    role_id: 3,
    status: 'Active'
  },
  {
    id: 2,
    create_at: '2025-02-10T10:45:00',
    create_by: 'admin',
    update_at: '2025-03-15T16:30:00',
    update_by: 'librarian',
    email: 'jane.smith@example.com',
    password: 'hashed_password',
    full_name: 'Jane Smith',
    gender: 'Female',
    age: 34,
    phone: '0912345678',
    refresh_token: null,
    role_id: 2,
    status: 'Active'
  },
  {
    id: 3,
    create_at: '2025-03-05T09:20:00',
    create_by: 'admin',
    update_at: '2025-04-25T11:10:00',
    update_by: 'admin',
    email: 'robert.johnson@example.com',
    password: 'hashed_password',
    full_name: 'Robert Johnson',
    gender: 'Male',
    age: 45,
    phone: '0923456789',
    refresh_token: null,
    role_id: 3,
    status: 'Suspended'
  },
  {
    id: 4,
    create_at: '2025-02-20T14:15:00',
    create_by: 'admin',
    update_at: '2025-04-10T13:45:00',
    update_by: 'admin',
    email: 'emily.brown@example.com',
    password: 'hashed_password',
    full_name: 'Emily Brown',
    gender: 'Female',
    age: 31,
    phone: '0934567890',
    refresh_token: null,
    role_id: 3,
    status: 'Banned'
  },
  {
    id: 5,
    create_at: '2025-01-25T11:30:00',
    create_by: 'admin',
    update_at: '2025-03-30T15:20:00',
    update_by: 'librarian',
    email: 'michael.wilson@example.com',
    password: 'hashed_password',
    full_name: 'Michael Wilson',
    gender: 'Male',
    age: 39,
    phone: '0945678901',
    refresh_token: null,
    role_id: 3,
    status: 'Active'
  }
];

function UserManagement() {
  // State cho users và roles
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formMode, setFormMode] = useState('add'); // 'add' hoặc 'edit'
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State cho user form
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    gender: 'Male',
    age: '',
    phone: '',
    role_id: '',
    status: 'Active'
  });

  // Load demo data
  useEffect(() => {
    setRoles(demoRoles);
    setUsers(demoUsers);
    setFilteredUsers(demoUsers);
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Handle user form input changes
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: name === 'age' || name === 'role_id' ? (value === '' ? '' : parseInt(value)) : value
    });
  };

  // Handle user form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    const currentDate = new Date().toISOString();
    
    if (formMode === 'add') {
      // Add new user
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        create_at: currentDate,
        create_by: 'current_admin', // Should come from authentication
        update_at: currentDate,
        update_by: 'current_admin', // Should come from authentication
        refresh_token: null,
        ...userForm
      };
      
      setUsers([...users, newUser]);
    } else {
      // Update existing user
      const updatedUsers = users.map(user => {
        if (user.id === currentUserId) {
          return {
            ...user,
            ...userForm,
            update_at: currentDate,
            update_by: 'current_admin' // Should come from authentication
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFormMode('add');
      setCurrentUserId(null);
    }
    
    // Reset form
    setUserForm({
      email: '',
      password: '',
      full_name: '',
      gender: 'Male',
      age: '',
      phone: '',
      role_id: '',
      status: 'Active'
    });
  };

  // Edit user
  const handleEditUser = (user) => {
    setFormMode('edit');
    setCurrentUserId(user.id);
    setUserForm({
      email: user.email,
      password: '', // Don't populate password for security reasons
      full_name: user.full_name,
      gender: user.gender,
      age: user.age,
      phone: user.phone,
      role_id: user.role_id,
      status: user.status
    });
  };

  // Change user status (suspend/activate/ban)
  const handleStatusChange = (userId, newStatus) => {
    const statusMap = {
      'suspend': 'Suspended',
      'activate': 'Active',
      'ban': 'Banned'
    };
    
    const statusText = statusMap[newStatus];
    const confirmMessages = {
      'suspend': 'Bạn có chắc chắn muốn đình chỉ người dùng này?',
      'activate': 'Bạn có chắc chắn muốn kích hoạt người dùng này?',
      'ban': 'Bạn có chắc chắn muốn cấm người dùng này?'
    };
    
    if (window.confirm(confirmMessages[newStatus])) {
      const currentDate = new Date().toISOString();
      
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: statusText,
            update_at: currentDate,
            update_by: 'current_admin' // Should come from authentication
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
    }
  };

  // Cancel form edit
  const handleCancelEdit = () => {
    setFormMode('add');
    setCurrentUserId(null);
    setUserForm({
      email: '',
      password: '',
      full_name: '',
      gender: 'Male',
      age: '',
      phone: '',
      role_id: '',
      status: 'Active'
    });
  };

  // Get role name by id
  const getRoleName = (roleId) => {
    const role = roles.find(role => role.id === roleId);
    return role ? role.name : 'Không xác định';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className={styles.userManagementContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý người dùng</h1>
      </div>
      
      <div className={styles.userManagementLayout}>
        <div className={styles.formContainer}>
          <h2 className={styles.formHeader}>
            {formMode === 'add' ? 'Thêm người dùng mới' : 'Cập nhật thông tin người dùng'}
          </h2>
          
          <form onSubmit={handleUserSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={userForm.email} 
                onChange={handleUserFormChange} 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">
                {formMode === 'add' ? 'Mật khẩu:' : 'Mật khẩu mới (để trống nếu không thay đổi):'}
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={userForm.password} 
                onChange={handleUserFormChange} 
                required={formMode === 'add'} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="full_name">Họ và tên:</label>
              <input 
                type="text" 
                id="full_name" 
                name="full_name" 
                value={userForm.full_name} 
                onChange={handleUserFormChange} 
                required 
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="gender">Giới tính:</label>
                <select 
                  id="gender" 
                  name="gender" 
                  value={userForm.gender} 
                  onChange={handleUserFormChange} 
                  required
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="age">Tuổi:</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age" 
                  min="1" 
                  max="120" 
                  value={userForm.age} 
                  onChange={handleUserFormChange} 
                  required 
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Số điện thoại:</label>
              <input 
                type="text" 
                id="phone" 
                name="phone" 
                value={userForm.phone} 
                onChange={handleUserFormChange} 
                required 
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="role_id">Vai trò:</label>
                <select 
                  id="role_id" 
                  name="role_id" 
                  value={userForm.role_id} 
                  onChange={handleUserFormChange} 
                  required
                >
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="status">Trạng thái:</label>
                <select 
                  id="status" 
                  name="status" 
                  value={userForm.status} 
                  onChange={handleUserFormChange} 
                  required
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Suspended">Đình chỉ</option>
                  <option value="Banned">Cấm</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {formMode === 'add' ? 'Thêm người dùng' : 'Cập nhật người dùng'}
              </button>
              
              {formMode === 'edit' && (
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className={styles.userListContainer}>
          <div className={styles.searchBar}>
            <input 
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>
              <i className="fas fa-search"></i> Tìm
            </button>
          </div>
          
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Cập nhật lần cuối</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{getRoleName(user.role_id)}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[user.status.toLowerCase()]}`}>
                      {user.status === 'Active' ? 'Hoạt động' : 
                       user.status === 'Suspended' ? 'Đình chỉ' : 'Cấm'}
                    </span>
                  </td>
                  <td>{formatDate(user.update_at)}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditUser(user)}
                    >
                      Sửa
                    </button>
                    
                    {user.status === 'Active' && (
                      <button 
                        className={styles.suspendButton}
                        onClick={() => handleStatusChange(user.id, 'suspend')}
                      >
                        Đình chỉ
                      </button>
                    )}
                    
                    {user.status === 'Suspended' && (
                      <>
                        <button 
                          className={styles.activateButton}
                          onClick={() => handleStatusChange(user.id, 'activate')}
                        >
                          Kích hoạt
                        </button>
                        <button 
                          className={styles.banButton}
                          onClick={() => handleStatusChange(user.id, 'ban')}
                        >
                          Cấm
                        </button>
                      </>
                    )}
                    
                    {user.status === 'Banned' && (
                      <button 
                        className={styles.activateButton}
                        onClick={() => handleStatusChange(user.id, 'activate')}
                      >
                        Kích hoạt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Không tìm thấy người dùng nào
            </div>
          )}
          
          <div className={styles.pagination}>
            <button className={styles.paginationButton}>Trước</button>
            <button className={`${styles.paginationButton} ${styles.active}`}>1</button>
            <button className={styles.paginationButton}>2</button>
            <button className={styles.paginationButton}>3</button>
            <button className={styles.paginationButton}>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;