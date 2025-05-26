import styles from "./UserManager.module.css"
import {Search, FilterIcon as Funnel, ChevronDown, Plus, Trash2, Edit, Ban, CheckCircle, 
  User, Shield} from "lucide-react"
import { useState } from "react"
import Notification from "../../../components/adminComponents/notification/Notification"

export default function UserManager() {
  const [addNewUser, setAddNewUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    ageRange: "",
    sort: "created_desc",
  })
  const [editUser, setEditUser] = useState(null)

  // handle add new user
  function handleCancelAddNewUser() {
    setAddNewUser(false)
  }

  function handleSaveUser(userData) {
    console.log("Saving user:", userData)
    setAddNewUser(false)
  }

  // handle edit user
  function handleCancelEditUser() {
    setEditUser(false)
  }

  function handleSaveEditUser(userData) {
    console.log("Updating user role:", userData)
    setEditUser(null)
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = !filters.role || user.role === filters.role

    let matchesAge = true
    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split("-").map(Number)
      if (max) {
        matchesAge = user.age >= min && user.age <= max
      } else {
        matchesAge = user.age >= min
      }
    }
    return matchesSearch && matchesRole && matchesAge
  })

  return (
    <div className="adminTabPage">
      
      <div className="adminPageTitle">Quản lý người dùng</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <UserTable users={filteredUsers} setEditUser={setEditUser} />
      </div>

      {addNewUser && <UserForm onSave={handleSaveUser} onCancel={handleCancelAddNewUser} />}

      {editUser && <EditUserForm user={editUser} onSave={handleSaveEditUser} onCancel={handleCancelEditUser} />}
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
      ageRange: "",
      sort: "created_desc",
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
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Độ tuổi</label>
            <select
              className={styles.filterSelect}
              value={filters.ageRange}
              onChange={(e) => handleFilterChange("ageRange", e.target.value)}
            >
              <option value="">Tất cả độ tuổi</option>
              <option value="18-25">18-25 tuổi</option>
              <option value="26-35">26-35 tuổi</option>
              <option value="36-45">36-45 tuổi</option>
              <option value="46-60">46-60 tuổi</option>
              <option value="60">Trên 60 tuổi</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sắp xếp</label>
            <select
              className={styles.filterSelect}
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="created_desc">Mới nhất</option>
              <option value="created_asc">Cũ nhất</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
              <option value="age_asc">Tuổi tăng dần</option>
              <option value="age_desc">Tuổi giảm dần</option>
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

const UserTable = ({ users, setEditUser }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [showBlockNoti, setShowBlockNoti] = useState({ state: false })

  function handleShowDeleteNoti(userId, userName) {
    setShowDeleteNoti({ state: true, id: userId, name: userName })
  }

  function handleShowBlockNoti(userId, userName, currentStatus) {
    setShowBlockNoti({
      state: true,
      id: userId,
      name: userName,
      action: currentStatus === "Active" ? "block" : "unblock",
    })
  }

  function handleDelete(id) {
    console.log("delete user with id: ", id)
  }

  function handleBlockUser(id, action) {
    console.log(`${action} user with id: `, id)
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  function handleConfirmBlock() {
    handleBlockUser(showBlockNoti.id, showBlockNoti.action)
    setShowBlockNoti({ ...showBlockNoti, state: false })
  }

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className={styles.roleAdmin}>
          <Shield size={12} />
          Admin
        </span>
      )
    }
    return (
      <span className={styles.roleUser}>
        <User size={12} />
        User
      </span>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className={styles.statusActive}>Hoạt động</span>
      case "Blocked":
        return <span className={styles.statusBlocked}>Bị khóa</span>
      case "Inactive":
        return <span className={styles.statusInactive}>Không hoạt động</span>
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
            <th>Email</th>
            <th>Tuổi</th>
            <th>Vai trò</th>
            <th>Đang thuê</th>
            <th>Quá hạn</th>
            <th>Đơn đã đặt</th>
            <th>Đơn chờ</th>
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
                  <img src={user.imageUrl || "/placeholder.svg?height=40&width=40"} alt={user.fullName} />
                </div>
              </td>
              <td>
                <div className={styles.userInfo}>
                  <h3>{user.fullName}</h3>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{getRoleBadge(user.role)}</td>
              <td>
                <span className={styles.rentingCount}>{user.rentingBooks || 0}</span>
              </td>
              <td>
                <span className={user.overdueBooks > 0 ? styles.overdueCount : styles.noOverdue}>
                  {user.overdueBooks || 0}
                </span>
              </td>
              <td>
                <span className={styles.completedOrders}>{user.completedOrders || 0}</span>
              </td>
              <td>
                <span className={styles.pendingOrders}>{user.pendingOrders || 0}</span>
              </td>
              <td>{getStatusBadge(user.status)}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton} title="Chỉnh sửa vai trò" onClick={() => setEditUser(user)}>
                    <Edit size={16} />
                  </button>

                  {user.status === "Active" ? (
                    <button
                      className={styles.blockButton}
                      title="Khóa tài khoản"
                      onClick={() => handleShowBlockNoti(user.id, user.fullName, user.status)}
                    >
                      <Ban size={16} />
                    </button>
                  ) : (
                    <button
                      className={styles.unblockButton}
                      title="Mở khóa tài khoản"
                      onClick={() => handleShowBlockNoti(user.id, user.fullName, user.status)}
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}

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
    imageUrl: user?.imageUrl || "",
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || null)

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

    // Validation
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
      imageUrl: imagePreview,
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
                <option value="user">User</option>
                <option value="admin">Admin</option>
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

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [role, setRole] = useState(user?.role || "user")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...user, role })
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.editFormContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Chỉnh sửa vai trò người dùng</h2>

          <div className={styles.userInfoDisplay}>
            <div className={styles.userImageDisplay}>
              <img src={user.imageUrl || "/placeholder.svg?height=60&width=60"} alt={user.fullName} />
            </div>
            <div>
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Vai trò *</label>
            <select
              name="role"
              className={styles.formSelect}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              Cập nhật vai trò
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Mock data
const users = [
  {
    id: 1,
    email: "admin@bookstore.com",
    fullName: "Nguyễn Văn Admin",
    gender: "Male",
    age: 30,
    role: "admin",
    imageUrl: "/auth.jpg",
    status: "Active",
    rentingBooks: 0,
    overdueBooks: 0,
    completedOrders: 15,
    pendingOrders: 2,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    email: "nguyen.van.a@gmail.com",
    fullName: "Nguyễn Văn A",
    gender: "Male",
    age: 25,
    role: "user",
    imageUrl: "/auth.jpg",
    status: "Active",
    rentingBooks: 3,
    overdueBooks: 1,
    completedOrders: 8,
    pendingOrders: 1,
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    email: "tran.thi.b@gmail.com",
    fullName: "Trần Thị B",
    gender: "Female",
    age: 22,
    role: "user",
    imageUrl: "/auth.jpg",
    status: "Active",
    rentingBooks: 2,
    overdueBooks: 0,
    completedOrders: 12,
    pendingOrders: 0,
    createdAt: "2024-02-10",
  },
  {
    id: 4,
    email: "le.van.c@gmail.com",
    fullName: "Lê Văn C",
    gender: "Male",
    age: 35,
    role: "user",
    imageUrl: null,
    status: "Blocked",
    rentingBooks: 0,
    overdueBooks: 3,
    completedOrders: 5,
    pendingOrders: 0,
    createdAt: "2024-01-25",
  },
  {
    id: 5,
    email: "pham.thi.d@gmail.com",
    fullName: "Phạm Thị D",
    gender: "Female",
    age: 28,
    role: "user",
    imageUrl: "/auth.jpg",
    status: "Active",
    rentingBooks: 1,
    overdueBooks: 0,
    completedOrders: 20,
    pendingOrders: 3,
    createdAt: "2024-03-05",
  },
  {
    id: 6,
    email: "hoang.van.e@gmail.com",
    fullName: "Hoàng Văn E",
    gender: "Male",
    age: 45,
    role: "user",
    imageUrl: null,
    status: "Inactive",
    rentingBooks: 0,
    overdueBooks: 0,
    completedOrders: 3,
    pendingOrders: 0,
    createdAt: "2023-12-15",
  },
]
