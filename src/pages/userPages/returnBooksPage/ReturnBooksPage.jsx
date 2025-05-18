"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Book, Calendar, AlertTriangle, ArrowLeft, Truck, Home } from "lucide-react"
import styles from "./ReturnBooksPage.module.css"

const ReturnBooksPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [booksToReturn, setBooksToReturn] = useState([])
  const [returnMethod, setReturnMethod] = useState("library")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    note: "",
  })
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Lấy danh sách sách cần trả từ state
  useEffect(() => {
    if (location.state?.booksToReturn) {
      setBooksToReturn(location.state.booksToReturn)
    } else {
      // Nếu không có sách để trả, quay lại trang danh sách sách
      navigate("/rented-books")
    }

    // Mock addresses data
    const mockAddresses = [
      {
        id: 1,
        address: "123 Đường ABC",
        city: "Hồ Chí Minh",
        district: "Quận 1",
        is_default: true,
      },
      {
        id: 2,
        address: "456 Đường XYZ",
        city: "Hồ Chí Minh",
        district: "Quận 3",
        is_default: false,
      },
    ]
    setAddresses(mockAddresses)
    const defaultAddress = mockAddresses.find((addr) => addr.is_default)
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
      setFormData((prev) => ({
        ...prev,
        address: defaultAddress.address,
        city: defaultAddress.city,
        district: defaultAddress.district,
      }))
    }
  }, [location.state, navigate])

  // Xử lý thay đổi phương thức trả sách
  const handleReturnMethodChange = (method) => {
    setReturnMethod(method)
  }

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Xử lý chọn địa chỉ
  const handleAddressSelect = (addressId) => {
    if (addressId === "new") {
      setSelectedAddressId(null)
      setShowNewAddressForm(true)
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        district: "",
      }))
    } else {
      const selectedAddress = addresses.find((addr) => addr.id === addressId)
      if (selectedAddress) {
        setSelectedAddressId(addressId)
        setShowNewAddressForm(false)
        setFormData((prev) => ({
          ...prev,
          address: selectedAddress.address,
          city: selectedAddress.city,
          district: selectedAddress.district,
        }))
      }
    }
  }

  // Kiểm tra form
  const validateForm = () => {
    const newErrors = {}

    if (returnMethod === "online") {
      if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc"
      if (!formData.phone.trim()) {
        newErrors.phone = "Số điện thoại là bắt buộc"
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Số điện thoại không hợp lệ"
      }

      if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc"
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Tạo thông tin đơn hàng trả sách
        const returnDetails = {
          returnId: "RET-" + Math.floor(Math.random() * 10000),
          returnDate: new Date().toISOString(),
          books: booksToReturn,
          returnMethod: returnMethod,
          address:
            returnMethod === "online"
              ? `${formData.address}, ${formData.district}, ${formData.city}`
              : "Trả tại thư viện",
          totalDeposit: getTotalDeposit(),
          totalRental: getTotalRental(),
          totalOverdueFee: getTotalOverdueFee(),
          totalRefund: getTotalRefund(),
          estimatedPickupDate:
            returnMethod === "online" ? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() : null,
        }

        // Chuyển hướng đến trang xác nhận trả sách
        navigate("/return-success", {
          state: returnDetails,
          replace: true,
        })
      } catch (error) {
        console.error("Lỗi khi xử lý trả sách:", error)
        setErrors({ submit: "Có lỗi khi xử lý trả sách. Vui lòng thử lại." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Tính tổng tiền cọc
  const getTotalDeposit = () => {
    return booksToReturn.reduce((total, book) => total + book.deposit_amount, 0)
  }

  // Tính tổng tiền thuê
  const getTotalRental = () => {
    return booksToReturn.reduce((total, book) => total + book.rental_fee, 0)
  }

  // Tính tổng tiền phạt quá hạn
  const getTotalOverdueFee = () => {
    return booksToReturn.reduce((total, book) => total + (book.overdue_fee || 0), 0)
  }

  // Tính tổng tiền hoàn trả
  const getTotalRefund = () => {
    return getTotalDeposit() - getTotalRental() - getTotalOverdueFee()
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Lấy trạng thái hiển thị
  const getStatusDisplay = (status, dueDate) => {
    const daysLeft = calculateDaysLeft(dueDate)
    switch (status) {
      case "active":
        if (daysLeft <= 3 && daysLeft > 0) {
          return {
            text: `Sắp hết hạn (còn ${daysLeft} ngày)`,
            className: styles.statusWarning,
            icon: <Calendar size={16} />,
          }
        }
        return {
          text: `Đang thuê (còn ${daysLeft} ngày)`,
          className: styles.statusActive,
          icon: <Book size={16} />,
        }
      case "overdue":
        return {
          text: "Quá hạn",
          className: styles.statusOverdue,
          icon: <AlertTriangle size={16} />,
        }
      default:
        return {
          text: status,
          className: "",
          icon: null,
        }
    }
  }

  // Tính số ngày còn lại
  const calculateDaysLeft = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  return (
    <div className={styles.returnBooksPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <Link to="/rented-books" className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Quay lại danh sách sách</span>
          </Link>
          <h1 className={styles.pageTitle}>Trả sách</h1>
        </div>

        <div className={styles.returnContent}>
          <div className={styles.returnForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Phương thức trả sách</h2>
                <div className={styles.returnMethods}>
                  <div
                    className={`${styles.returnMethod} ${returnMethod === "library" ? styles.activeMethod : ""}`}
                    onClick={() => handleReturnMethodChange("library")}
                  >
                    <div className={styles.methodIcon}>
                      <Home size={24} />
                    </div>
                    <div className={styles.methodInfo}>
                      <h3 className={styles.methodTitle}>Trả tại thư viện</h3>
                      <p className={styles.methodDescription}>
                        Mang sách đến trả trực tiếp tại một trong các chi nhánh thư viện của chúng tôi
                      </p>
                    </div>
                    <div className={styles.methodRadio}>
                      <input
                        type="radio"
                        name="returnMethod"
                        checked={returnMethod === "library"}
                        onChange={() => handleReturnMethodChange("library")}
                      />
                    </div>
                  </div>

                  <div
                    className={`${styles.returnMethod} ${returnMethod === "online" ? styles.activeMethod : ""}`}
                    onClick={() => handleReturnMethodChange("online")}
                  >
                    <div className={styles.methodIcon}>
                      <Truck size={24} />
                    </div>
                    <div className={styles.methodInfo}>
                      <h3 className={styles.methodTitle}>Trả online</h3>
                      <p className={styles.methodDescription}>
                        Shipper sẽ đến địa chỉ của bạn để lấy sách và hoàn tiền (nếu có)
                      </p>
                    </div>
                    <div className={styles.methodRadio}>
                      <input
                        type="radio"
                        name="returnMethod"
                        checked={returnMethod === "online"}
                        onChange={() => handleReturnMethodChange("online")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {returnMethod === "library" && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Chi nhánh thư viện</h2>
                  <div className={styles.libraryLocations}>
                    <div className={styles.locationCard}>
                      <h3 className={styles.locationName}>Thư viện Trung tâm</h3>
                      <p className={styles.locationAddress}>123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                      <p className={styles.locationHours}>Giờ mở cửa: 8:00 - 21:00 (Thứ 2 - Chủ nhật)</p>
                    </div>
                    <div className={styles.locationCard}>
                      <h3 className={styles.locationName}>Thư viện Chi nhánh 1</h3>
                      <p className={styles.locationAddress}>456 Đường Lê Lợi, Quận 3, TP. Hồ Chí Minh</p>
                      <p className={styles.locationHours}>Giờ mở cửa: 8:00 - 20:00 (Thứ 2 - Thứ 7)</p>
                    </div>
                    <div className={styles.locationCard}>
                      <h3 className={styles.locationName}>Thư viện Chi nhánh 2</h3>
                      <p className={styles.locationAddress}>789 Đường Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh</p>
                      <p className={styles.locationHours}>Giờ mở cửa: 8:00 - 19:00 (Thứ 2 - Thứ 6)</p>
                    </div>
                  </div>
                  <div className={styles.libraryNote}>
                    <p>
                      <strong>Lưu ý:</strong> Vui lòng mang theo thẻ thư viện hoặc CMND/CCCD khi đến trả sách. Tiền cọc
                      sẽ được hoàn trả sau khi kiểm tra sách.
                    </p>
                  </div>
                </div>
              )}

              {returnMethod === "online" && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>Thông tin giao nhận</h2>

                  <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.formLabel}>
                      Họ và tên người gửi
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? styles.errorInput : ""}
                    />
                    {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? styles.errorInput : ""}
                    />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                  </div>

                  <h3 className={styles.addressTitle}>Địa chỉ lấy sách</h3>

                  {addresses.length > 0 && (
                    <div className={styles.savedAddresses}>
                      <h4 className={styles.addressSubtitle}>Địa chỉ đã lưu</h4>
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
                                {addr.district}, {addr.city}
                              </p>
                              {addr.is_default && <span className={styles.defaultBadge}>Mặc định</span>}
                            </div>
                            <div className={styles.addressRadio}>
                              <input
                                type="radio"
                                name="addressId"
                                checked={selectedAddressId === addr.id}
                                onChange={() => handleAddressSelect(addr.id)}
                              />
                            </div>
                          </div>
                        ))}
                        <div
                          className={`${styles.addressCard} ${styles.newAddress} ${
                            showNewAddressForm ? styles.selected : ""
                          }`}
                          onClick={() => handleAddressSelect("new")}
                        >
                          <div className={styles.addressInfo}>
                            <p>+ Thêm địa chỉ mới</p>
                          </div>
                          <div className={styles.addressRadio}>
                            <input
                              type="radio"
                              name="addressId"
                              checked={showNewAddressForm}
                              onChange={() => handleAddressSelect("new")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showNewAddressForm && (
                    <div className={styles.addressForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="address" className={styles.formLabel}>
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={errors.address ? styles.errorInput : ""}
                        />
                        {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="city" className={styles.formLabel}>
                            Thành phố
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={errors.city ? styles.errorInput : ""}
                          />
                          {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="district" className={styles.formLabel}>
                            Quận/Huyện
                          </label>
                          <input
                            type="text"
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            className={errors.district ? styles.errorInput : ""}
                          />
                          {errors.district && <span className={styles.errorMessage}>{errors.district}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label htmlFor="note" className={styles.formLabel}>
                      Ghi chú (không bắt buộc)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      className={styles.textArea}
                      placeholder="Thông tin thêm về việc lấy sách..."
                    ></textarea>
                  </div>

                  <div className={styles.onlineReturnNote}>
                    <p>
                      <strong>Lưu ý:</strong> Shipper sẽ đến địa chỉ của bạn trong vòng 24 giờ để lấy sách. Vui lòng
                      chuẩn bị sẵn sách và kiểm tra tình trạng sách trước khi giao cho shipper. Tiền cọc sẽ được hoàn
                      trả sau khi kiểm tra sách (trừ đi tiền thuê và phí phạt nếu có).
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Xác nhận trả sách</h2>
                <div className={styles.confirmationNote}>
                  <p>
                    Bạn đang trả {booksToReturn.length} cuốn sách. Vui lòng kiểm tra lại thông tin trước khi xác nhận.
                  </p>
                </div>

                {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận trả sách"}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.returnSummary}>
            <h2 className={styles.summaryTitle}>Thông tin sách trả</h2>

            <div className={styles.booksList}>
              {booksToReturn.map((book) => {
                const status = getStatusDisplay(book.status, book.due_date)
                return (
                  <div key={book.id} className={styles.bookItem}>
                    <img src={book.cover_image || "/placeholder.svg"} alt={book.title} className={styles.bookImage} />
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                      <div className={styles.bookDates}>
                        <div className={styles.dateItem}>
                          <span className={styles.dateLabel}>Ngày thuê:</span>
                          <span className={styles.dateValue}>{formatDate(book.rental_date)}</span>
                        </div>
                        <div className={styles.dateItem}>
                          <span className={styles.dateLabel}>Ngày trả:</span>
                          <span className={styles.dateValue}>{formatDate(book.due_date)}</span>
                        </div>
                      </div>
                      <div className={`${styles.bookStatus} ${status.className}`}>
                        {status.icon}
                        <span>{status.text}</span>
                      </div>
                      {book.status === "overdue" && (
                        <div className={styles.overdueFee}>
                          <span>Phí phạt quá hạn:</span>
                          <span>{book.overdue_fee.toLocaleString("vi-VN")}đ</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.costSummary}>
              <h3 className={styles.costTitle}>Tổng kết chi phí</h3>

              <div className={styles.costItem}>
                <span>Tổng tiền cọc:</span>
                <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.costItem}>
                <span>Tổng tiền thuê:</span>
                <span>-{getTotalRental().toLocaleString("vi-VN")}đ</span>
              </div>

              {getTotalOverdueFee() > 0 && (
                <div className={styles.costItem}>
                  <span>Phí phạt quá hạn:</span>
                  <span>-{getTotalOverdueFee().toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              <div className={`${styles.costItem} ${styles.totalRefund}`}>
                <span>Tổng tiền hoàn trả:</span>
                <span>{getTotalRefund().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.refundNote}>
                <p>
                  <strong>Lưu ý:</strong> Tiền hoàn trả là số tiền bạn sẽ nhận lại sau khi trừ đi tiền thuê và phí phạt
                  (nếu có) từ tiền cọc. Nếu số tiền âm, bạn cần thanh toán thêm.
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
