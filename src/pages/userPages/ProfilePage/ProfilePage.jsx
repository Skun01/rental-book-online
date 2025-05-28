import { useState, useEffect } from "react"
import { User, Mail, MapPin, Lock, Edit2, Plus, Trash2 } from 'lucide-react'
import styles from "./ProfilePage.module.css"
import { useAuth } from "../../../contexts/AuthContext"
import {useToast} from "../../../contexts/ToastContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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

  
  const [message, setMessage] = useState({ type: "", text: "" })
  const navigate = useNavigate();
  useEffect(() => {
    const bearer = localStorage.getItem('token')

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
  // checking:
  if(!currentUser){
      navigate('/')
    }
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
              <AddressTab userId={currentUser.id} editMode={editMode} setEditMode={setEditMode} 
                setMessage={setMessage}
              />
            )}

            {activeTab === "password" && (
              <PasswordTab userId={currentUser.id} setMessage={setMessage}/>
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
const AddressTab = ({ userId, editMode, setEditMode }) => {
  const [reloadAddress, setReloadAddress] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState({
    city: "",
    district: "",
    ward: "",
    street: ""
  })
  const {showToast} = useToast()

  // get all user address
  useEffect(()=>{
    const bearer = localStorage.getItem('token')
    async function getUserAddress(){
      await axios.get(`http://localhost:8080/api/v1/address/user/${userId}?page=0&size=10`, {
        headers: {
          Authorization: `${bearer}`
        }
      })
        .then(response=>{
          setAddresses(response.data.data.content)
          console.log(response)
        })
    }
    getUserAddress()
  }, [reloadAddress])

  // handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({
      ...prev,
      [name] : value,
    })
  )}

  // handle submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    // query create address
    try {
      await axios.post('http://localhost:8080/api/v1/address',
        {
          userId: userId,
          ...newAddress,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      ).then(response =>{
        setAddresses([...addresses, response.data.data])
      })
      
      setNewAddress({
        city: "",
        district: "",
        ward: "",
        street: "",
      })
      setEditMode(false)
      showToast({type: 'success', message: "Địa chỉ đã được thêm thành công!"})
    } catch (error) {
      showToast({type: 'error', message: "Có lỗi xảy ra khi thêm địa chỉ!"})
      console.error("Error adding address:", error)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/address/${addressId}`,
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      )
      setReloadAddress(!reloadAddress)
      showToast({ type: "success", message: "Địa chỉ đã được xóa thành công!" })
    } catch (error) {
      showToast({ type: 'error', message: "Có lỗi xảy ra khi xóa địa chỉ!" })
      console.error("Error deleting address:", error)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/address`,
        {
          userId: userId,
          addressId: addressId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      )
      setReloadAddress(!reloadAddress)
      showToast({ type: "success", message: "Đã cập nhật địa chỉ mặc định!" })
    } catch (error) {
      showToast({ type: 'error', message: "Có lỗi xảy ra khi cập nhật địa chỉ mặc định!" })
      console.error("Error setting default address:", error)
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
              type="text" id="city" name="city" value={newAddress.city}
              onChange={handleAddressChange} className={styles.formControl} required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="district" className={styles.formLabel}>
              Quận/Huyện
            </label>
            <input type="text" id="district" name="district" value={newAddress.district}
              onChange={handleAddressChange} className={styles.formControl} required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ward" className={styles.formLabel}>
              Phường/Xã
            </label>
            <input type="text" id="ward" name="ward" value={newAddress.ward}
              onChange={handleAddressChange} className={styles.formControl} required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="street" className={styles.formLabel}>
              Tên đường, số nhà
            </label>
            <input type="text" id="street" name="street" value={newAddress.street}
              onChange={handleAddressChange} className={styles.formControl} required 
            />
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
                    {address.isDefault === "true" && <span className={styles.defaultBadge}>Mặc định</span>}
                    Địa chỉ {address.isDefault === "true" ? "mặc định" : ""}
                  </h3>
                  <div className={styles.addressActions}>
                    {address.isDefault === 'false' && (
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
                    {address.city}, {address.district}, {address.ward}, {address.street}
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
const PasswordTab = ({ userId, setMessage }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const {showToast} = useToast()
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
      await axios.put('http://localhost:8080/api/v1/user/password',
        {
          userId: userId,
          currentPassword : passwordData.currentPassword,
          newPassword: passwordData.currentPassword
        }
      )
      showToast({ type: "success", message: "Mật khẩu đã được cập nhật thành công!" })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setMessage({ type: "", text: "" })
    } catch (error) {
      if(error.response && error.response.status === 400){
        setMessage({type: "error", text: "Mật khẩu cũ không chính xác"})
      }else{
        showToast({type: "error", message: "Có lỗi xảy ra khi đổi mật khẩu!"})
        console.error("there is a password change error", error)
      }
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
