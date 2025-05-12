"use client"

import { useState, useEffect } from "react"
import { User, Mail, MapPin, Lock, Edit2, Plus, Trash2 } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import styles from "./ProfilePage.module.css"

const ProfilePage = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    full_name: currentUser?.fullName || "",
    email: currentUser?.email || "",
    gender: currentUser?.gender || "MALE",
    age: currentUser?.age || "",
    avatar: currentUser?.avatar || "",
  })

  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState({
    city: "",
    district: "",
    province: "",
    is_default: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  // Fetch addresses when component mounts
  useEffect(() => {
    // TODO: Fetch addresses from API
    // For now using mock data
    setAddresses([
      {
        id: 1,
        city: "Hồ Chí Minh",
        district: "Quận 1",
        province: "Phường Bến Nghé",
        is_default: true
      }
    ])
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setEditMode(false)
    setMessage({ type: "", text: "" })
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
    setMessage({ type: "", text: "" })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Call API to update user profile
      setMessage({ type: "success", text: "Thông tin cá nhân đã được cập nhật thành công!" })
      setEditMode(false)
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi cập nhật thông tin!" })
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới và xác nhận mật khẩu không khớp!" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự!" })
      return
    }

    try {
      // TODO: Call API to change password
      setMessage({ type: "success", text: "Mật khẩu đã được cập nhật thành công!" })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi đổi mật khẩu!" })
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Call API to add new address
      if (newAddress.is_default) {
        // Update other addresses to not be default
        setAddresses(addresses.map(addr => ({
          ...addr,
          is_default: false
        })))
      }
      
      const newAddressWithId = {
        ...newAddress,
        id: Date.now() // Temporary ID, should come from API
      }
      
      setAddresses([...addresses, newAddressWithId])
      setNewAddress({
        city: "",
        district: "",
        province: "",
        is_default: false
      })
      setEditMode(false)
      setMessage({ type: "success", text: "Địa chỉ mới đã được thêm thành công!" })
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi thêm địa chỉ!" })
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      // TODO: Call API to delete address
      setAddresses(addresses.filter(addr => addr.id !== addressId))
      setMessage({ type: "success", text: "Địa chỉ đã được xóa thành công!" })
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi xóa địa chỉ!" })
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      // TODO: Call API to set default address
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      })))
      setMessage({ type: "success", text: "Đã cập nhật địa chỉ mặc định!" })
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi cập nhật địa chỉ mặc định!" })
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Thông tin tài khoản</h1>

        <div className={styles.profileContent}>
          <div className={styles.profileTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
              onClick={() => handleTabChange("info")}
            >
              <User size={18} />
              <span>Thông tin cá nhân</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "address" ? styles.activeTab : ""}`}
              onClick={() => handleTabChange("address")}
            >
              <MapPin size={18} />
              <span>Địa chỉ</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "password" ? styles.activeTab : ""}`}
              onClick={() => handleTabChange("password")}
            >
              <Lock size={18} />
              <span>Đổi mật khẩu</span>
            </button>
          </div>

          <div className={styles.profileDetails}>
            {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

            {activeTab === "info" && (
              <div className={styles.infoTab}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
                  <button className={styles.editButton} onClick={handleEditToggle}>
                    {editMode ? (
                      "Hủy"
                    ) : (
                      <>
                        <Edit2 size={16} />
                        <span>Chỉnh sửa</span>
                      </>
                    )}
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="full_name" className={styles.formLabel}>
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="gender" className={styles.formLabel}>
                          Giới tính
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={styles.formControl}
                        >
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="age" className={styles.formLabel}>
                          Tuổi
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={styles.formControl}
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.saveButton}>
                      Lưu thay đổi
                    </button>
                  </form>
                ) : (
                  <div className={styles.userInfo}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <User size={20} />
                      </div>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Họ và tên</span>
                        <span className={styles.infoValue}>{formData.full_name}</span>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <Mail size={20} />
                      </div>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Email</span>
                        <span className={styles.infoValue}>{formData.email}</span>
                      </div>
                    </div>

                    <div className={styles.infoRow}>
                      <div className={styles.infoItem}>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Giới tính</span>
                          <span className={styles.infoValue}>
                            {formData.gender === "MALE" ? "Nam" : formData.gender === "FEMALE" ? "Nữ" : "Khác"}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Tuổi</span>
                          <span className={styles.infoValue}>{formData.age}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "address" && (
              <div className={styles.addressTab}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Địa chỉ của tôi</h2>
                  <button className={styles.addButton} onClick={() => setEditMode(true)}>
                    <Plus size={16} />
                    <span>Thêm địa chỉ mới</span>
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                    <h3 className={styles.formSubtitle}>Thêm địa chỉ mới</h3>

                    <div className={styles.formGroup}>
                      <label htmlFor="province" className={styles.formLabel}>
                        Tỉnh/Thành phố
                      </label>
                      <input 
                        type="text" 
                        id="province" 
                        name="province" 
                        value={newAddress.province}
                        onChange={handleAddressChange}
                        className={styles.formControl} 
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="city" className={styles.formLabel}>
                        Quận/Huyện
                      </label>
                      <input 
                        type="text" 
                        id="city" 
                        name="city" 
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className={styles.formControl} 
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="district" className={styles.formLabel}>
                        Phường/Xã
                      </label>
                      <input 
                        type="text" 
                        id="district" 
                        name="district" 
                        value={newAddress.district}
                        onChange={handleAddressChange}
                        className={styles.formControl} 
                        required 
                      />
                    </div>

                    <div className={styles.formCheckbox}>
                      <input 
                        type="checkbox" 
                        id="is_default" 
                        name="is_default"
                        checked={newAddress.is_default}
                        onChange={handleAddressChange}
                      />
                      <label htmlFor="is_default">Đặt làm địa chỉ mặc định</label>
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveButton}>
                        Lưu địa chỉ
                      </button>
                      <button type="button" className={styles.cancelButton} onClick={() => setEditMode(false)}>
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.addressList}>
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address.id} className={styles.addressCard}>
                          <div className={styles.addressHeader}>
                            <h3 className={styles.addressTitle}>
                              {address.is_default && <span className={styles.defaultBadge}>Mặc định</span>}
                              Địa chỉ {address.is_default ? "mặc định" : ""}
                            </h3>
                            <div className={styles.addressActions}>
                              {!address.is_default && (
                                <button 
                                  className={styles.setDefaultButton}
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Đặt làm mặc định
                                </button>
                              )}
                              <button 
                                className={styles.deleteAddressButton}
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className={styles.addressDetails}>
                            <p>
                              {address.district}, {address.city}, {address.province}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noAddress}>
                        <p>Bạn chưa có địa chỉ nào.</p>
                        <button className={styles.addAddressButton} onClick={() => setEditMode(true)}>
                          Thêm địa chỉ mới
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className={styles.passwordTab}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword" className={styles.formLabel}>
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={styles.formControl}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.formLabel}>
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={styles.formControl}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={styles.formControl}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.saveButton}>
                    Cập nhật mật khẩu
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
