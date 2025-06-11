import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { useToast } from "../../../contexts/ToastContext"
import axios from "axios"
import { ArrowLeft, MapPin, Clock, Book, AlertTriangle } from "lucide-react"
import styles from "./ReturnBooksPage.module.css"

// API function to get all branches
const getAllBranches = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get("http://localhost:8080/api/v1/branch/all?page=0&size=1000&sortDir=asc", {
      headers: {
        Authorization: `${token}`,
      },
    })
    return response.data.data.content
  } catch (error) {
    console.error("Error fetching branches:", error)
    throw error
  }
}

// Branch Card Component
const BranchCard = ({ branch, isSelected, onSelect }) => {
  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    try {
      const time = timeString.split("T")[1]?.split("Z")[0] || timeString
      const [hours, minutes] = time.split(":")
      return `${hours}:${minutes}`
    } catch (error) {
      return "N/A"
    }
  }

  const formatAddress = (branch) => {
    const parts = [branch.street, branch.ward, branch.district, branch.city].filter(Boolean)
    return parts.join(", ") || "Chưa có địa chỉ"
  }

  return (
    <div
      className={`${styles.branchCard} ${isSelected ? styles.selectedBranch : ""}`}
      onClick={() => onSelect(branch.id)}
    >
      <div className={styles.branchHeader}>
        <input
          type="radio"
          name="branchSelection"
          checked={isSelected}
          onChange={() => onSelect(branch.id)}
          className={styles.branchRadio}
        />
        <h4 className={styles.branchName}>{branch.name}</h4>
      </div>

      <div className={styles.branchDetails}>
        <div className={styles.branchAddress}>
          <span className={styles.addressIcon}>
            <MapPin size={15} />
          </span>
          <span>{formatAddress(branch)}</span>
        </div>

        <div className={styles.branchHours}>
          <span className={styles.timeIcon}>
            <Clock size={15} />
          </span>
          <span>
            Giờ mở cửa: {formatTime(branch.openTime)} - {formatTime(branch.closeTime)}
          </span>
        </div>
      </div>
    </div>
  )
}

const ReturnBooksPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState([])
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [booksToReturn, setBooksToReturn] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    deliveryMethod: "Offline", // [Offline, Online]
    branchId: null,
    returnDate: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    notes: "",
    paymentMethod: "Cash",
    paymentStatus: "Unpaid",
    shippingMethod: "Express",
  })
  const [errors, setErrors] = useState({})
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationData = location.state?.booksToReturn || []
  console.log(navigationData)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true)
        const branchesData = await getAllBranches()
        setBranches(branchesData)
        if (branchesData.length > 0) {
          setFormData((prev) => ({ ...prev, branchId: branchesData[0].id }))
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
        showToast({ type: "error", message: "Lỗi khi tải danh sách chi nhánh!" })
      } finally {
        setLoadingBranches(false)
      }
    }

    fetchBranches()
  }, [showToast])

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (navigationData.length === 0) {
        setLoadingBooks(false)
        return
      }

      try {
        setLoadingBooks(true)
        const bookDetails = navigationData
        setBooksToReturn(bookDetails)
      } catch (error) {
        console.error("Error fetching book details:", error)
        showToast({ type: "error", message: "Lỗi khi tải thông tin sách!" })
      } finally {
        setLoadingBooks(false)
      }
    }

    fetchBookDetails()
  }, [navigationData, showToast])

  // Get user addresses
  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const bearer = localStorage.getItem("token")
        const response = await axios.get(
          `http://localhost:8080/api/v1/address/by/user/${currentUser.id}?page=0&size=10`,
          {
            headers: {
              Authorization: `${bearer}`,
            },
          },
        )
        setAddresses(response.data.data.content)
        const defaultAddress = response.data.data.content.find((addr) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
          setFormData((prev) => ({
            ...prev,
            city: defaultAddress.city,
            district: defaultAddress.district,
            ward: defaultAddress.ward,
            street: defaultAddress.street,
          }))
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
      }
    }

    if (currentUser?.id) {
      fetchUserAddresses()
    }
  }, [currentUser?.id])

  // Get available return dates (next 7 days)
  const getAvailableReturnDates = () => {
    const dates = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      })
    }
    return dates
  }

  // Get expected return date
  const getExpectedDate = () => {
    if (formData.deliveryMethod === "Offline") {
      if (formData.returnDate) {
        const date = new Date(formData.returnDate)
        return `${date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}`
      }
      return "Chưa chọn thời gian"
    } else {
      const days = formData.shippingMethod === "Express" ? 1 : 3
      const date = new Date()
      date.setDate(date.getDate() + days)
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleBranchSelect = (branchId) => {
    setFormData((prev) => ({ ...prev, branchId }))
    if (errors.branchId) {
      setErrors((prev) => ({ ...prev, branchId: "" }))
    }
  }

  const handleAddressSelect = (addressId) => {
    if (addressId === "new") {
      setSelectedAddressId(null)
      setShowNewAddressForm(true)
      setFormData((prev) => ({
        ...prev,
        city: "",
        district: "",
        ward: "",
        street: "",
      }))
    } else {
      const selectedAddress = addresses.find((addr) => addr.id === addressId)
      if (selectedAddress) {
        setSelectedAddressId(addressId)
        setShowNewAddressForm(false)
        setFormData((prev) => ({
          ...prev,
          city: selectedAddress.city,
          district: selectedAddress.district,
          ward: selectedAddress.ward,
          street: selectedAddress.street,
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc"

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (formData.deliveryMethod === "Offline") {
      if (!formData.branchId) newErrors.branchId = "Vui lòng chọn chi nhánh"
      if (!formData.returnDate) newErrors.returnDate = "Vui lòng chọn ngày trả sách"
    }

    if (formData.deliveryMethod === "Online") {
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc"
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc"
      if (!formData.ward.trim()) newErrors.ward = "Phường/Xã là bắt buộc"
      if (!formData.street.trim()) newErrors.street = "Đường/Phố là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getReturnData = () => {
    const basicData = {
      userId: currentUser.id,
      fullName: formData.fullName,
      phone: formData.phone,
      notes: formData.notes,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      itemIdLists: navigationData.map(item=>item.id)
    }

    if (formData.deliveryMethod === "Offline") {
      return {
        ...basicData,
        branchId: +formData.branchId,
        rentedDay: new Date(formData.returnDate).toISOString(),
      }
    } else {
      return {
        ...basicData,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        street: formData.street,
        shippingMethod: formData.shippingMethod,
        rentedDay: new Date(
          Date.now() + (formData.shippingMethod === "Express" ? 24 : 72) * 60 * 60 * 1000,
        ).toISOString(),
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        const returnData = getReturnData()
        const bearer = localStorage.getItem("token")
        console.log(returnData)
        await axios.post("http://localhost:8080/api/v1/order/rented/create", returnData, {
          headers: {
            Authorization: `${bearer}`,
          },
        })

        showToast({ type: "success", message: "Yêu cầu trả sách đã được gửi thành công!" })
        navigate("/my-orders") // Navigate back to orders page
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu trả sách:", error)
        showToast({ type: "error", message: "Có lỗi khi xử lý yêu cầu trả sách" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getTotalDeposit = () => {
    return booksToReturn.reduce((total, item) => total + (item.totalDeposit || item.depositPrice * item.quantity), 0)
  }

  const getTotalRental = () => {
    return booksToReturn.reduce((total, item) => total + (item.totalRental || item.rentalPrice * item.quantity), 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case "Processing":
        return {
          text: "Đang xử lý",
          className: styles.statusProcessing,
          icon: <Book size={16} />,
        }
      case "Received":
        return {
          text: "Đã nhận",
          className: styles.statusReceived,
          icon: <Book size={16} />,
        }
      case "Overdue":
        return {
          text: "Quá hạn",
          className: styles.statusOverdue,
          icon: <AlertTriangle size={16} />,
        }
      default:
        return {
          text: status,
          className: "",
          icon: <Book size={16} />,
        }
    }
  }

  if (loadingBooks) {
    return (
      <div className={styles.returnBooksPage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>Đang tải thông tin sách...</div>
        </div>
      </div>
    )
  }

  if (booksToReturn.length === 0) {
    return (
      <div className={styles.returnBooksPage}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h2>Không có sách để trả</h2>
            <button onClick={() => navigate("/my-orders")} className={styles.backButton}>
              <ArrowLeft size={20} />
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.returnBooksPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          <h1 className={styles.pageTitle}>Trả Sách</h1>
        </div>

        <div className={styles.returnGrid}>
          <div className={styles.returnFormContainer}>
            <form onSubmit={handleSubmit} className={styles.returnForm}>
              {/* Personal Information */}
              <div className={styles.formSection}>
                <h2>Thông Tin Cá Nhân</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Họ và Tên</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? styles.error : ""}
                  />
                  {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? styles.error : ""}
                  />
                  {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>
              </div>

              {/* Return Method */}
              <div className={styles.formSection}>
                <h2>Phương Thức Trả Sách</h2>
                <div className={styles.deliveryOptions}>
                  <div className={styles.deliveryOption}>
                    <input
                      type="radio"
                      id="library-return"
                      name="deliveryMethod"
                      value="Offline"
                      checked={formData.deliveryMethod === "Offline"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="library-return">
                      <span className={styles.optionTitle}>Trả tại thư viện</span>
                      <span className={styles.optionDescription}>
                        Mang sách đến trả trực tiếp tại chi nhánh thư viện
                      </span>
                    </label>
                  </div>

                  <div className={styles.deliveryOption}>
                    <input
                      type="radio"
                      id="pickup-return"
                      name="deliveryMethod"
                      value="Online"
                      checked={formData.deliveryMethod === "Online"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pickup-return">
                      <span className={styles.optionTitle}>Lấy sách tại nhà</span>
                      <span className={styles.optionDescription}>Shipper sẽ đến lấy sách tại địa chỉ của bạn</span>
                    </label>
                  </div>
                </div>

                {/* Library Return Details */}
                {formData.deliveryMethod === "Offline" && (
                  <div className={styles.deliverySection}>
                    <div className={styles.formGroup}>
                      <label>Chọn chi nhánh trả sách</label>
                      {loadingBranches ? (
                        <div className={styles.loadingBranches}>Đang tải danh sách chi nhánh...</div>
                      ) : branches.length > 0 ? (
                        <div className={styles.branchSelection}>
                          {branches.map((branch) => (
                            <BranchCard
                              key={branch.id}
                              branch={branch}
                              isSelected={formData.branchId === branch.id}
                              onSelect={handleBranchSelect}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={styles.noBranches}>Không có chi nhánh nào khả dụng</div>
                      )}
                      {errors.branchId && <span className={styles.errorMessage}>{errors.branchId}</span>}
                    </div>

                    <h3>Thời gian hẹn trả sách</h3>
                    <p className={styles.pickupNote}>
                      Vui lòng chọn thời gian trong vòng 7 ngày kể từ hôm nay để đến trả sách tại thư viện.
                    </p>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="returnDate">Ngày trả</label>
                        <select
                          id="returnDate"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          className={errors.returnDate ? styles.error : ""}
                        >
                          <option value="">Chọn ngày</option>
                          {getAvailableReturnDates().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                        {errors.returnDate && <span className={styles.errorMessage}>{errors.returnDate}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Online Return Details */}
                {formData.deliveryMethod === "Online" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="shippingMethod">Phương thức lấy sách</label>
                    <select
                      id="shippingMethod"
                      name="shippingMethod"
                      value={formData.shippingMethod}
                      onChange={handleInputChange}
                    >
                      <option value="Standard">Tiêu chuẩn (3 ngày)</option>
                      <option value="Express">Nhanh (1 ngày)</option>
                    </select>
                  </div>
                )}

                {/* Address Selection for Online Return */}
                {formData.deliveryMethod === "Online" && (
                  <div className={styles.deliverySection}>
                    <h3>Thông tin lấy sách</h3>
                    {addresses.length > 0 && (
                      <div className={styles.savedAddresses}>
                        <h4>Địa chỉ đã lưu</h4>
                        <div className={styles.addressList}>
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ""}`}
                              onClick={() => handleAddressSelect(addr.id)}
                            >
                              <div className={styles.addressInfo}>
                                <p>{addr.address}</p>
                                <p>
                                  {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                                </p>
                                {addr.isDefault === "true" && <span className={styles.defaultBadge}>Mặc định</span>}
                              </div>
                            </div>
                          ))}
                          <div
                            className={`${styles.addressCard} ${styles.newAddress} ${showNewAddressForm ? styles.selected : ""}`}
                            onClick={() => handleAddressSelect("new")}
                          >
                            <div className={styles.addressInfo}>
                              <p>+ Thêm địa chỉ mới</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {showNewAddressForm && (
                      <div className={styles.addressForm}>
                        <h4>Địa chỉ mới</h4>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="city">Thành phố</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={errors.city ? styles.error : ""}
                            />
                            {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                          </div>

                          <div className={styles.formGroup}>
                            <label htmlFor="district">Quận/Huyện</label>
                            <input
                              type="text"
                              id="district"
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              className={errors.district ? styles.error : ""}
                            />
                            {errors.district && <span className={styles.errorMessage}>{errors.district}</span>}
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="ward">Phường/Xã</label>
                            <input
                              type="text"
                              id="ward"
                              name="ward"
                              value={formData.ward}
                              onChange={handleInputChange}
                              className={errors.ward ? styles.error : ""}
                            />
                            {errors.ward && <span className={styles.errorMessage}>{errors.ward}</span>}
                          </div>

                          <div className={styles.formGroup}>
                            <label htmlFor="street">Đường/Phố</label>
                            <input
                              type="text"
                              id="street"
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              className={errors.street ? styles.error : ""}
                            />
                            {errors.street && <span className={styles.errorMessage}>{errors.street}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className={styles.formSection}>
                <h2>Ghi chú</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="notes">Ghi chú (tùy chọn)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Thêm ghi chú cho việc trả sách..."
                    className={styles.orderNote}
                  />
                </div>
              </div>

              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
              <button type="submit" className={styles.returnButton} disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Xác nhận trả sách"}
              </button>
            </form>
          </div>

          <div className={styles.returnSummaryContainer}>
            <div className={styles.returnSummary}>
              <h2 className={styles.summaryTitle}>Sách cần trả</h2>

              <div className={styles.bookItems}>
                {booksToReturn.map((item) => {
                  const status = getStatusDisplay(item.status)
                  return (
                    <div key={item.id} className={styles.bookItem}>
                      <div className={styles.itemImage}>
                        <img
                          src={item.imageUrl || "/placeholder.svg?height=280&width=200"}
                          alt={item.bookName}
                          className={styles.itemThumbnail}
                        />
                        {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                      </div>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{item.bookName}</h3>
                        <div className={styles.itemDetails}>
                          <span className={styles.itemRentDate}>Ngày thuê: {formatDate(item.rentalDate)}</span>
                          <span className={styles.itemQuantityText}>Số lượng: {item.quantity}</span>
                        </div>
                        <div className={`${styles.itemStatus} ${status.className}`}>
                          {status.icon}
                          <span>{status.text}</span>
                        </div>
                        <div className={styles.itemPrice}>
                          Tiền cọc: {(item.totalDeposit || item.depositPrice * item.quantity).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Tổng số sách:</span>
                  <span>{booksToReturn.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng tiền cọc:</span>
                  <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng phí thuê:</span>
                  <span>{getTotalRental().toLocaleString("vi-VN")}đ</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{formData.deliveryMethod === "Online" ? "Ngày lấy dự kiến:" : "Ngày trả sách:"}</span>
                  <span className={styles.expectedDate}>{getExpectedDate()}</span>
                </div>

                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span>Tiền hoàn trả dự kiến:</span>
                  <span>{(getTotalDeposit() - getTotalRental()).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className={styles.returnNote}>
                <p>
                  <strong>Lưu ý:</strong> <br />- Tiền cọc sẽ được hoàn trả sau khi kiểm tra tình trạng sách.
                  <br />- Nếu sách bị hư hỏng, một phần tiền cọc sẽ được giữ lại để bồi thường.
                  <br />- Thời gian hoàn tiền: 1-3 ngày làm việc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnBooksPage
