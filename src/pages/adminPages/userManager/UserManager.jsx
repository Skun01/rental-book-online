import styles from "./UserManager.module.css"
import UserDetailModal from "../../../components/adminComponents/userDetailModal/UserDetailModal"
import { Search, FilterIcon as Funnel, ChevronDown, Plus, Trash2, Ban, CheckCircle, User,
  Shield, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import Notification from "../../../components/adminComponents/notification/Notification"
import { AllUserGet, updateUserRolePut, deleteUserDelete,
  createUserPost
  } from "../../../api/userApi"
import { useToast } from "../../../contexts/ToastContext"

const token = localStorage.getItem('token')

export default function UserManager() {
  const [addNewUser, setAddNewUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    gender: "",
    ageRange: "",
    sort: "age_asc",
  })
  const [filteredUsers, setFilteredUsers] = useState([])
  const [viewUser, setViewUser] = useState(null)
  const [loading, setLoading] = useState(false) 
  const {showToast} = useToast()

  useEffect(()=>{
    async function getAllUser(){
      setLoading(true)
      try{
        const params = new URLSearchParams({
          page: '0',
          size: '1000',
          sortBy: getSortBy(filters.sort), 
          sortDir: getSortDir(filters.sort),
        })

        if (searchTerm.trim()) {
          params.append('keyword', searchTerm.trim())
        }

        if (filters.gender) {
          params.append('gender', filters.gender)
        }

        if (filters.role) {
          params.append('roleId', filters.role)
        }

        const apiUrl = `/user/all?${params.toString()}`
        const userData = await AllUserGet(apiUrl, token)
        setFilteredUsers(userData)
      }catch(err){
        console.error(`can't get all users: `, err)
        showToast({type: 'error', message: 'Không thể tải danh sách người dùng!'})
      } finally {
        setLoading(false)
      }
    }
    
    if(token){
      getAllUser()
    }
  }, [searchTerm, filters])
  function getSortBy(sortValue) {
    switch(sortValue) {
      case 'age_asc':
      case 'age_desc':
        return 'age'
      case 'name_asc':
      case 'name_desc':
        return 'fullName'
      default:
        return 'age'
    }
  }
  function getSortDir(sortValue) {
    return sortValue.includes('_desc') ? 'desc' : 'asc'
  }
  function handleCancelAddNewUser() {
    setAddNewUser(false)
  }

  async function handleSaveUser(userData) {
    try{
      const newUser = await createUserPost(userData, token)
      setAddNewUser(false)
      setFilteredUsers([...filteredUsers, newUser])
      showToast({type: 'success', message: 'Tạo người dùng thành công'})
    }catch(err){
      console.error(`can't create new user: `, err)
      showToast({type: 'error', message: 'Không thể tạo người dùng!'})
    }
  }

  const [searchTimeout, setSearchTimeout] = useState(null)
  function handleSearchChange(e) {
    const value = e.target.value
    setSearchTerm(value)
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
    }, 500)
    setSearchTimeout(timeout)
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý người dùng</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo tên người dùng..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.toolActions}>
          <Filter filters={filters} setFilters={setFilters} />
          <button className={styles.addButton} onClick={() => setAddNewUser(true)}>
            <Plus size={20} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <UserTable users={filteredUsers} setViewUser={setViewUser} setUsers={setFilteredUsers}/>
        )}
      </div>

      {addNewUser && <UserForm onSave={handleSaveUser} onCancel={handleCancelAddNewUser} />}

      {viewUser && <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />}
    </div>
  )
}

const Filter = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilter = () => {
    setIsOpen(false)
  }

  const handleResetFilter = () => {
    setFilters({
      role: "",
      gender: "",
      sort: "age_asc",
    })
    setIsOpen(false)
  }

  return (
    <div className={styles.filterContainer}>
      <button className={styles.filterButton} onClick={() => setIsOpen(!isOpen)}>
        <Funnel size={16} />
        <span>Bộ lọc</span>
        <ChevronDown size={16} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Vai trò</label>
            <select
              className={styles.filterSelect}
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="2">Nhân viên</option>
              <option value="3">Người dùng</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Giới tính</label>
            <select
              className={styles.filterSelect}
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="">Tất cả giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sắp xếp theo tuổi</label>
            <select
              className={styles.filterSelect}
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="age_asc">Tuổi tăng dần</option>
              <option value="age_desc">Tuổi giảm dần</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.filterReset} onClick={handleResetFilter}>
              Đặt lại
            </button>
            <button className={styles.filterApply} onClick={handleApplyFilter}>
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const UserTable = ({ users, setViewUser, setUsers }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [showBlockNoti, setShowBlockNoti] = useState({ state: false })
  const [editingRole, setEditingRole] = useState(null)
  const [newRoleId, setNewRoleId] = useState("")

  function handleShowDeleteNoti(userId, userName) {
    setShowDeleteNoti({ state: true, id: userId, name: userName })
  }

  function handleEditRole(user) {
    setEditingRole(user.id)
    setNewRoleId(user.role?.id)
  }

  async function handleSaveRole(userId) {
    try{
      await updateUserRolePut(userId, +newRoleId, token)
    }catch(err){
      console.error(`can't update user role: `, err)
    }
    setEditingRole(null)
  }

  function handleCancelEditRole() {
    setEditingRole(null)
    setNewRoleId("")
  }

  async function handleConfirmDelete() {
    try{
      await deleteUserDelete(showDeleteNoti.id, token)
      const newUsers = users.filter((user)=>user.id !== showDeleteNoti.id)
      setUsers(newUsers)
      setShowDeleteNoti({ ...showDeleteNoti, state: false })
    }catch(err){
      console.error(`can't delete user: `, err)
    }
  }

  function handleConfirmBlock() {
    setShowBlockNoti({ ...showBlockNoti, state: false })
  }

  const getRoleBadge = (user) => {
    if (editingRole === user.id) {
      return (
        <div className={styles.roleEditContainer}>
          <select className={styles.roleSelect} value={newRoleId} onChange={(e) => setNewRoleId(e.target.value)}>
            <option value="2">Nhân viên</option>
            <option value="3">Người dùng</option>
          </select>
          <div className={styles.roleEditActions}>
            <button className={styles.saveRoleButton} onClick={() => handleSaveRole(user.id)} title="Lưu">
              <CheckCircle size={12} />
            </button>
            <button className={styles.cancelRoleButton} onClick={handleCancelEditRole} title="Hủy">
              ×
            </button>
          </div>
        </div>
      )
    }
    if (user.role?.name === "STAFF") {
      return (
        <span className={styles.roleAdmin} onClick={() => handleEditRole(user)}>
          <Shield size={12} />
          Nhân viên
        </span>
      )
    }
    return (
      <span className={styles.roleUser} onClick={() => handleEditRole(user)}>
        <User size={12} />
        Người dùng
      </span>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className={styles.statusActive}>Hoạt động</span>
      case "Blocked":
        return <span className={styles.statusBlocked}>Bị khóa</span>
      default:
        return <span className={styles.statusUnknown}>Không xác định</span>
    }
  }

  if (users.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.noResults}>
          <p>Không tìm thấy người dùng nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>Vai trò</th>
            <th>Đang thuê</th>
            <th>Quá hạn</th>
            <th>Đơn đã đặt</th>
            <th>Đơn đã trả</th>
            <th>Trạng thái</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>#{user.id}</td>
              <td>
                <div className={styles.userImage}>
                  <img src={user.imageUrl || "/author.jpg"} alt={user.fullName} />
                </div>
              </td>
              <td>
                <div className={styles.userInfo}>
                  <h3>{user.fullName}</h3>
                </div>
              </td>
              <td>{user.age}</td>
              <td>{getRoleBadge(user)}</td>
              <td>
                <span className={styles.rentingCount}>{user.rentingBooks || 0}</span>
              </td>
              <td>
                <span className={user.overdueBooks > 0 ? styles.overdueCount : styles.noOverdue}>
                  {user.overdueBooks || 0}
                </span>
              </td>
              <td>
                <span className={styles.completedOrders}>{user.totalRental || 0}</span>
              </td>
              <td>
                <span className={styles.returnedOrders}>{user.totalRented || 0}</span>
              </td>
              <td>{getStatusBadge(user.status)}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.viewButton} title="Xem chi tiết" onClick={() => setViewUser(user)}>
                    <Eye size={16} />
                  </button>

                  <button
                    className={styles.deleteButton}
                    title="Xóa người dùng"
                    onClick={() => handleShowDeleteNoti(user.id, user.fullName)}
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
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa người dùng "${showDeleteNoti.name}" không?`}
        />
      )}

      {showBlockNoti.state && (
        <Notification
          handleConfirm={handleConfirmBlock}
          handleCancel={() => setShowBlockNoti({ ...showBlockNoti, state: false })}
          content={`Bạn có chắc chắn muốn ${showBlockNoti.action === "block" ? "khóa" : "mở khóa"} tài khoản "${showBlockNoti.name}" không?`}
        />
      )}
    </div>
  )
}

const UserForm = ({ user = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    fullName: user?.fullName || "",
    gender: user?.gender || "Male",
    age: user?.age || "",
    role: user?.role || "user",
    avatar: user?.avatar || "",
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(user?.avatar || null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.email.trim() || !formData.fullName.trim()) {
      alert("Vui lòng nhập email và họ tên")
      return
    }

    if (!user && !formData.password.trim()) {
      alert("Vui lòng nhập mật khẩu")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ")
      return
    }

    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      alert("Tuổi phải từ 1 đến 120")
      return
    }

    if (!user && formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    const processedData = {
      ...formData,
      age: Number.parseInt(formData.age) || null,
      avatar: imagePreview,
      imageFile: imageFile,
    }

    onSave(processedData)
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email *</label>
              <input
                type="email"
                name="email"
                className={styles.formInput}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                required
              />
            </div>

            {!user && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  className={styles.formInput}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Họ tên *</label>
              <input
                type="text"
                name="fullName"
                className={styles.formInput}
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ tên"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Giới tính</label>
              <select name="gender" className={styles.formSelect} value={formData.gender} onChange={handleInputChange}>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tuổi</label>
              <input
                type="number"
                name="age"
                className={styles.formInput}
                value={formData.age}
                onChange={handleInputChange}
                placeholder="0"
                min="1"
                max="120"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Vai trò</label>
              <select name="role" className={styles.formSelect} value={formData.role} onChange={handleInputChange}>
                <option value="2">Nhân viên</option>
                <option value="3">Người dùng</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ảnh đại diện</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className={styles.formInput} />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              {user ? "Cập nhật" : "Thêm người dùng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}