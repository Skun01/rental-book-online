import styles from "./BranchManager.module.css"
import { Search, Plus, Trash2, Edit, MapPin, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import Notification from "../../../components/adminComponents/notification/Notification"
import { useToast } from "../../../contexts/ToastContext"

const token = localStorage.getItem('token')
const API_BASE_URL = 'http://localhost:8080/api/v1/branch'

// API functions
const getAllBranches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all?page=0&size=1000&sortDir=asc`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    return response.data.data.content
  } catch (error) {
    console.error('Error fetching branches:', error)
    throw error
  }
}

const getBranchById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/by/${id}`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching branch by id:', error)
    throw error
  }
}

const createBranch = async (branchData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, branchData, {
      headers: {
        'Authorization': `${token}`,
      }
    })
    console.log('createBranch: ', response)
    return response.data
  } catch (error) {
    console.error('Error creating branch:', error)
    throw error
  }
}

const updateBranch = async (id, branchData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, branchData, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating branch:', error)
    throw error
  }
}

const deleteBranches = async (branchIds) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delete`, branchIds, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting branches:', error)
    throw error
  }
}

export default function BranchManager() {
  const [addNewBranch, setAddNewBranch] = useState(false)
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBranches, setFilteredBranches] = useState([])
  const {showToast} = useToast()
  
  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBranches(branches)
    } else {
      setFilteredBranches(
        branches.filter(branch => 
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.district.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [branches, searchTerm])

  function handleCancelAddNewBranch() {
    setAddNewBranch(false)
  }

  async function handleSaveBranch(branchData) {
    try {
      setLoading(true)
      const newBranch = {
        name: branchData.name,
        city: branchData.city,
        district: branchData.district,
        ward: branchData.ward,
        street: branchData.street,
        openTime: branchData.openTime,
        closeTime: branchData.closeTime
      }

      await createBranch(newBranch)
      await fetchBranches()
      setAddNewBranch(false)
      showToast({type: 'success', message: 'Thêm chi nhánh thành công!'})
    } catch (error) {
      console.error("Error creating branch:", error)
      showToast({type: 'error', message: 'Lỗi khi thêm chi nhánh!'})
    } finally {
      setLoading(false)
    }
  }

  async function fetchBranches(){
      try {
        setLoading(true)
        const branchesData = await getAllBranches()
        setBranches(branchesData)
      } catch (error) {
        console.error("Error fetching branches:", error)
        showToast({type: 'error', message: 'Lỗi khi tải danh sách chi nhánh!'})
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý chi nhánh</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="Tìm kiếm theo tên chi nhánh, thành phố..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.addBranchContainer}>
          <button 
            className={styles.addButton} 
            onClick={() => setAddNewBranch(true)}
            disabled={loading}
          >
            <Plus size={20} />
            <span>Thêm chi nhánh mới</span>
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Đang tải...
          </div>
        ) : (
          <BranchTable 
            branches={filteredBranches} 
            onRefresh={fetchBranches}
            setLoading={setLoading}
          />
        )}
      </div>

      {addNewBranch && (
        <BranchForm 
          onSave={handleSaveBranch} 
          onCancel={handleCancelAddNewBranch} 
        />
      )}
    </div>
  )
}

const BranchTable = ({ branches, onRefresh, setLoading }) => {
  const [showDeleteNoti, setShowDeleteNoti] = useState({ state: false })
  const [isEditing, setIsEditing] = useState({ state: false })
  const [selectedBranches, setSelectedBranches] = useState([])
  const {showToast} = useToast()
  
  function handleShowDeleteNoti(branchId, branchName) {
    setShowDeleteNoti({ state: true, id: branchId, name: branchName })
  }

  async function handleDelete(id) {
    try {
      setLoading(true)
      await deleteBranches([id])
      await onRefresh()
      showToast({type: 'success', message: 'Xóa chi nhánh thành công!'})
    } catch (error) {
      console.error("Error deleting branch:", error)
      showToast({type: 'error', message: 'Lỗi khi xóa chi nhánh!'})
    } finally {
      setLoading(false)
    }
  }

  function handleConfirmDelete() {
    handleDelete(showDeleteNoti.id)
    setShowDeleteNoti({ ...showDeleteNoti, state: false })
  }

  function handleEditBranch(branch) {
    setIsEditing({ state: true, branch: branch })
  }

  async function handleSaveEditedBranch(branchData) {
    try {
      setLoading(true)
      const editedBranch = {
        name: branchData.name,
        city: branchData.city,
        district: branchData.district,
        ward: branchData.ward,
        street: branchData.street,
        openTime: branchData.openTime,
        closeTime: branchData.closeTime
      }
      await updateBranch(branchData.id, editedBranch)
      await onRefresh()
      setIsEditing({ state: false })
      showToast({type: 'success', message: 'Cập nhật chi nhánh thành công!'})
    } catch (error) {
      console.error("Error updating branch:", error)
      showToast({type: 'error', message: 'Lỗi khi cập nhật chi nhánh!'})
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } catch (error) {
      return "N/A"
    }
  }

  const formatAddress = (branch) => {
    const parts = [branch.street, branch.ward, branch.district, branch.city].filter(Boolean)
    return parts.join(', ') || "Chưa có địa chỉ"
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã chi nhánh</th>
            <th>Tên chi nhánh</th>
            <th>Địa chỉ</th>
            <th>Giờ mở cửa</th>
            <th>Giờ đóng cửa</th>
            <th>Ngày tạo</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>#{branch.id}</td>
              <td>
                <div className={styles.branchName}>
                  <MapPin size={16} className={styles.locationIcon} />
                  {branch.name}
                </div>
              </td>
              <td>
                <span className={styles.address}>
                  {formatAddress(branch)}
                </span>
              </td>
              <td>
                <div className={styles.timeInfo}>
                  <Clock size={14} />
                  {formatTime(branch.openTime)}
                </div>
              </td>
              <td>
                <div className={styles.timeInfo}>
                  <Clock size={14} />
                  {formatTime(branch.closeTime)}
                </div>
              </td>
              <td>
                {branch.createAt ? new Date(branch.createAt).toLocaleDateString('vi-VN') : "N/A"}
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditBranch(branch)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleShowDeleteNoti(branch.id, branch.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {branches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Không có chi nhánh nào
        </div>
      )}
      
      {/* show delete notification */}
      {showDeleteNoti.state && (
        <Notification
          handleConfirm={handleConfirmDelete}
          handleCancel={() => setShowDeleteNoti({ ...showDeleteNoti, state: false })}
          content={`Bạn có chắc chắn muốn xóa chi nhánh "${showDeleteNoti.name}" không?`}
        />
      )}

      {/* show edit form */}
      {isEditing.state && (
        <BranchForm
          branch={isEditing.branch}
          onSave={handleSaveEditedBranch}
          onCancel={() => setIsEditing({ state: false })}
        />
      )}
    </div>
  )
}

function BranchForm({ branch, onSave, onCancel }) {
  const [name, setName] = useState(branch?.name || "")
  const [city, setCity] = useState(branch?.city || "")
  const [district, setDistrict] = useState(branch?.district || "")
  const [ward, setWard] = useState(branch?.ward || "")
  const [street, setStreet] = useState(branch?.street || "")
  const [openTime, setOpenTime] = useState(
    branch?.openTime ? new Date(branch.openTime).toTimeString().slice(0, 5) : ""
  )
  const [closeTime, setCloseTime] = useState(
    branch?.closeTime ? new Date(branch.closeTime).toTimeString().slice(0, 5) : ""
  )
  const [submitting, setSubmitting] = useState(false)
  const {showToast} = useToast()

  const formatTimeForSubmit = (timeString) => {
    if (!timeString) return null
    const today = new Date().toISOString().split('T')[0]
    return `${today}T${timeString}:00.000Z`
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) {
      showToast({type: 'error', message: 'Vui lòng nhập tên chi nhánh!'})
      return
    }

    if (!city.trim()) {
      showToast({type: 'error', message: 'Vui lòng nhập thành phố!'})
      return
    }

    if (!openTime || !closeTime) {
      showToast({type: 'error', message: 'Vui lòng nhập giờ mở cửa và đóng cửa!'})
      return
    }

    if (openTime >= closeTime) {
      showToast({type: 'error', message: 'Giờ mở cửa phải trước giờ đóng cửa!'})
      return
    }

    try {
      setSubmitting(true)
      
      const branchData = {
        id: branch?.id,
        name: name.trim(),
        city: city.trim(),
        district: district.trim(),
        ward: ward.trim(),
        street: street.trim(),
        openTime: formatTimeForSubmit(openTime),
        closeTime: formatTimeForSubmit(closeTime)
      }

      onSave(branchData)
    } catch (error) {
      console.error("Error in form submission:", error)
      showToast({type: 'error', message: 'Có lỗi xảy ra!'})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>
            {branch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
          </h2>

          <div className={styles.formGroup}>
            <label htmlFor="branchName" className={styles.formLabel}>
              Tên chi nhánh *
            </label>
            <input
              type="text"
              id="branchName"
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên chi nhánh"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="branchCity" className={styles.formLabel}>
                Thành phố *
              </label>
              <input
                type="text"
                id="branchCity"
                className={styles.formInput}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Nhập thành phố"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="branchDistrict" className={styles.formLabel}>
                Quận/Huyện
              </label>
              <input
                type="text"
                id="branchDistrict"
                className={styles.formInput}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Nhập quận/huyện"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="branchWard" className={styles.formLabel}>
                Phường/Xã
              </label>
              <input
                type="text"
                id="branchWard"
                className={styles.formInput}
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="Nhập phường/xã"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="branchStreet" className={styles.formLabel}>
                Đường/Số nhà
              </label>
              <input
                type="text"
                id="branchStreet"
                className={styles.formInput}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nhập đường/số nhà"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="branchOpenTime" className={styles.formLabel}>
                Giờ mở cửa *
              </label>
              <input
                type="time"
                id="branchOpenTime"
                className={styles.formInput}
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="branchCloseTime" className={styles.formLabel}>
                Giờ đóng cửa *
              </label>
              <input
                type="time"
                id="branchCloseTime"
                className={styles.formInput}
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onCancel}
              disabled={submitting}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}