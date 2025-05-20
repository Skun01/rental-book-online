import { useState, useEffect } from "react"
import { User, Mail, MapPin, Lock, Edit2, Plus, Trash2 } from 'lucide-react'
import styles from "./ProfilePage.module.css"
import { useAuth } from "../../../contexts/AuthContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const mockUserData = {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  gender: "MALE",
  age: 28,
  avatar: null
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  const {currentUser} = useAuth()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    gender: "",
    age: "",
    password: ""
  })

  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState({
    city: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })
  const navigate = useNavigate();
  useEffect(() => {
    const bearer = localStorage.getItem('token')
    if(!bearer){
      navigate('/')
    }
    // user address
    async function getUserAddress(){
      await axios.get(`http://localhost:8080/api/v1/address/user/${currentUser.id}?page=0&size=5`, {
        headers: {
          Authorization: `${bearer}`
        }
      })
        .then(response=>{
          setAddresses(response.data.data.content)
        })
    }
    getUserAddress()

    // full user infor
    async function getFullUserInfor(){
      await axios.get(`http://localhost:8080/api/v1/user/${currentUser.id}`, {
        headers: {
          Authorization: `${bearer}`
        }
      })
        .then(response=>{
          const fullUserInfor = response.data.data
          setFormData({
            full_name: fullUserInfor.fullName || "",
            email: fullUserInfor.email || "",
            gender: fullUserInfor.gender.toUpperCase() || "",
            age: (fullUserInfor.age) || "",
            password: '123456',
          })
        })
    }
    getFullUserInfor();
  }, [])

  // update userInfor 

  async function updateUser(){
    await axios.put(`http://localhost:8080/api/v1/user/${currentUser.id}`, 
    {
      fullName: formData.full_name,
      gender: formData.gender === 'MALE' ? 'Male' : formData.gender === 'FEMALE' ? 'Female' : 'Other',
      age: formData.age,
      email: formData.email,
      password: formData.password
    },
    {
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
    })
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setEditMode(false)
    setMessage({ type: "", text: "" })
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
    setMessage({ type: "", text: "" })
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Thông tin tài khoản</h1>

        <div className={styles.profileContent}>
          {/* Tabs */}
          <ProfileTabs activeTab={activeTab} handleTabChange={handleTabChange} />

          {/* Content */}
          <div className={styles.profileDetails}>
            {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

            {activeTab === "info" && (
              <PersonalInfoTab 
                editMode={editMode} 
                formData={formData} 
                setFormData={setFormData} 
                handleEditToggle={handleEditToggle}
                setMessage={setMessage}
                handleSubmitForm = {updateUser}
              />
            )}

            {activeTab === "address" && (
              <AddressTab 
                addresses={addresses} 
                setAddresses={setAddresses}
                newAddress={newAddress}
                setNewAddress={setNewAddress}
                editMode={editMode}
                setEditMode={setEditMode}
                setMessage={setMessage}
              />
            )}

            {activeTab === "password" && (
              <PasswordTab 
                passwordData={passwordData} 
                setPasswordData={setPasswordData}
                setMessage={setMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Component tabs
const ProfileTabs = ({ activeTab, handleTabChange }) => {
  return (
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
  )
}

// tab thông tin cá nhân
const PersonalInfoTab = ({ editMode, formData, setFormData, handleEditToggle, setMessage, handleSubmitForm }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      handleSubmitForm()
      handleEditToggle()
    } catch (error) {
      setMessage({ type: error, text: "Có lỗi xảy ra khi cập nhật thông tin!" })
    }
  }

  return (
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
              <label className={styles.formLabel}>Giới tính</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === "MALE"}
                    onChange={handleInputChange}
                  />
                  Nam
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === "FEMALE"}
                    onChange={handleInputChange}
                  />
                  Nữ
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="OTHER"
                    checked={formData.gender === "OTHER"}
                    onChange={handleInputChange}
                  />
                  Không xác định
                </label>
              </div>
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
                  {formData.gender === "MALE" ? "Nam" : formData.gender === "FEMALE" ? "Nữ" : "Không xác định"}
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
  )
}

// tab địa chỉ
const AddressTab = ({ addresses, setAddresses, newAddress, setNewAddress, editMode, setEditMode, setMessage }) => {
  const {currentUser} = useAuth()
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    try {
      if (newAddress.isDefault) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: false
        })))
      }
      
      // query create address
      await axios.post('http://localhost:8080/api/v1/address',
        {
          userId: currentUser.id,
          ...newAddress,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      )

      setAddresses([...addresses, newAddress])
      setNewAddress({
        city: "",
        district: "",
        province: "",
        street: "",
        isDefault: false
      })
      setEditMode(false)
      setMessage({ type: "success", text: "Địa chỉ mới đã được thêm thành công!" })
    } catch (error) {
      setMessage({ type: error, text: "Có lỗi xảy ra khi thêm địa chỉ!" })
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      setAddresses(addresses.filter(addr => addr.id !== addressId))
      setMessage({ type: "success", text: "Địa chỉ đã được xóa thành công!" })
    } catch (error) {
      setMessage({ type: error, text: "Có lỗi xảy ra khi xóa địa chỉ!" })
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })))
      setMessage({ type: "success", text: "Đã cập nhật địa chỉ mặc định!" })
    } catch (error) {
      setMessage({ type: error, text: "Có lỗi xảy ra khi cập nhật địa chỉ mặc định!" })
    }
  }

  return (
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
            <label htmlFor="city" className={styles.formLabel}>
              Tỉnh/Thành phố
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
              Quận/Huyện
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

          <div className={styles.formGroup}>
            <label htmlFor="ward" className={styles.formLabel}>
              Phường/Xã
            </label>
            <input 
              type="text" 
              id="ward" 
              name="ward" 
              value={newAddress.ward}
              onChange={handleAddressChange}
              className={styles.formControl} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="street" className={styles.formLabel}>
              Tên đường
            </label>
            <input 
              type="text" 
              id="street" 
              name="street" 
              value={newAddress.street}
              onChange={handleAddressChange}
              className={styles.formControl} 
              required 
            />
          </div>

          <div className={styles.formCheckbox}>
            <input 
              type="checkbox" 
              id="isDefault" 
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={handleAddressChange}
            />
            <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
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
                    {address.isDefault && <span className={styles.defaultBadge}>Mặc định</span>}
                    Địa chỉ {address.isDefault ? "mặc định" : ""}
                  </h3>
                  <div className={styles.addressActions}>
                    {!address.isDefault && (
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
  )
}

// tab đổi mật khẩu
const PasswordTab = ({ passwordData, setPasswordData, setMessage }) => {
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      setMessage({ type: "success", text: "Mật khẩu đã được cập nhật thành công!" })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setMessage({ type: error, text: "Có lỗi xảy ra khi đổi mật khẩu!" })
    }
  }

  return (
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
  )
}

export default ProfilePage
