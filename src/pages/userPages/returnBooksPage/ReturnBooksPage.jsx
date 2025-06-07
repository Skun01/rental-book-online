import { useState } from "react"
import { Book, AlertTriangle, ArrowLeft, Truck, Home } from "lucide-react"
import styles from "./ReturnBooksPage.module.css"

// Sample data based on your JSON structure
const sampleReturnData = {
  id: 9007199254740991,
  city: "Hồ Chí Minh",
  district: "Quận 1",
  ward: "Phường Bến Nghé",
  street: "123 Đường Nguyễn Huệ",
  notes: "Giao hàng vào buổi sáng",
  fullName: "Nguyễn Văn An",
  phone: "0901234567",
  deliveryMethod: "online",
  orderStatus: "pending",
  paymentStatus: "pending",
  paymentMethod: "cash",
  receiveDay: "2025-06-06T09:00:00.000Z",
  userId: 123456,
  items: [
    {
      id: 1,
      rentalDate: "2025-05-01T00:00:00.000Z",
      rentedDate: "2025-05-01T00:00:00.000Z",
      bookName: "Người tối cổ",
      imageUrl: "/placeholder.svg?height=280&width=200",
      rentalPrice: 15000,
      depositPrice: 50000,
      quantity: 1,
      totalRental: 15000,
      totalDeposit: 50000,
      itemStatus: "active",
      createAt: "2025-05-01T00:00:00.000Z",
      updateAt: "2025-06-05T00:00:00.000Z",
      createBy: "user123",
      updateBy: "user123",
    },
    {
      id: 2,
      rentalDate: "2025-04-20T00:00:00.000Z",
      rentedDate: "2025-04-20T00:00:00.000Z",
      bookName: "Dế Mèn phiêu lưu ký",
      imageUrl: "/placeholder.svg?height=280&width=200",
      rentalPrice: 12000,
      depositPrice: 45000,
      quantity: 1,
      totalRental: 12000,
      totalDeposit: 45000,
      itemStatus: "active",
      createAt: "2025-04-20T00:00:00.000Z",
      updateAt: "2025-06-05T00:00:00.000Z",
      createBy: "user123",
      updateBy: "user123",
    },
    {
      id: 3,
      rentalDate: "2025-04-10T00:00:00.000Z",
      rentedDate: "2025-04-10T00:00:00.000Z",
      bookName: "Tắt đèn",
      imageUrl: "/placeholder.svg?height=280&width=200",
      rentalPrice: 18000,
      depositPrice: 60000,
      quantity: 1,
      totalRental: 18000,
      totalDeposit: 60000,
      itemStatus: "overdue",
      createAt: "2025-04-10T00:00:00.000Z",
      updateAt: "2025-06-05T00:00:00.000Z",
      createBy: "user123",
      updateBy: "user123",
    },
  ],
  createAt: "2025-06-05T02:15:13.087Z",
  updateAt: "2025-06-05T02:15:13.087Z",
  createBy: "user123",
  updateBy: "user123",
}

const ReturnBooks = () => {
  const [returnMethod, setReturnMethod] = useState("library")
  const [formData, setFormData] = useState({
    fullName: sampleReturnData.fullName,
    phone: sampleReturnData.phone,
    city: sampleReturnData.city,
    district: sampleReturnData.district,
    ward: sampleReturnData.ward,
    street: sampleReturnData.street,
    notes: sampleReturnData.notes,
    branchId: 1,
    returnDate: "",
    refundMethod: "bank", // bank, wallet, cash
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleReturnMethodChange = (method) => {
    setReturnMethod(method)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const getAvailableReturnDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayNames = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
      const dayName = dayNames[date.getDay()]
      const dateStr = date.toLocaleDateString("vi-VN")
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? `Hôm nay (${dateStr})` : `${dayName} (${dateStr})`
      })
    }
    
    return dates
  }

  const validateForm = () => {
    const newErrors = {}

    if (returnMethod === "online") {
      if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc"
      if (!formData.phone.trim()) {
        newErrors.phone = "Số điện thoại là bắt buộc"
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Số điện thoại không hợp lệ"
      }
      if (!formData.street.trim()) newErrors.street = "Địa chỉ là bắt buộc"
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc"
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Prepare data for backend
        const returnPayload = {
          ...sampleReturnData,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          street: formData.street,
          notes: formData.notes,
          fullName: formData.fullName,
          phone: formData.phone,
          deliveryMethod: returnMethod,
          receiveDay: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        console.log("Data to send to backend:", returnPayload)
        alert("Đã gửi yêu cầu trả sách thành công!")
      } catch (error) {
        console.error("Error:", error)
        setErrors({ submit: "Có lỗi khi xử lý trả sách. Vui lòng thử lại." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getTotalDeposit = () => {
    return sampleReturnData.items.reduce((total, item) => total + item.totalDeposit, 0)
  }

  const getTotalRental = () => {
    return sampleReturnData.items.reduce((total, item) => total + item.totalRental, 0)
  }

  const getTotalOverdueFee = () => {
    return sampleReturnData.items
      .filter((item) => item.itemStatus === "overdue")
      .reduce((total, item) => total + item.rentalPrice * 0.5, 0) // 50% phí phạt
  }

  const getTotalRefund = () => {
    return getTotalDeposit() - getTotalRental() - getTotalOverdueFee()
  }

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case "active":
        return {
          text: "Đang thuê",
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

  return (
    <div className={styles.returnBooksPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <button className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Quay lại danh sách sách</span>
          </button>
          <h1 className={styles.pageTitle}>Trả sách</h1>
        </div>

        <div className={styles.returnContent}>
          <div className={styles.returnForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Phương thức trả sách</h2>
                <div className={styles.returnMethods}>
                  <div className={styles.deliveryOption}>
                    <input
                      type="radio"
                      id="library-return"
                      name="returnMethod"
                      value="library"
                      checked={returnMethod === "library"}
                      onChange={(e) => handleReturnMethodChange(e.target.value)}
                    />
                    <label htmlFor="library-return">
                      <div className={styles.methodIcon}>
                        <Home size={24} />
                      </div>
                      <div className={styles.methodInfo}>
                        <span className={styles.optionTitle}>Trả tại thư viện</span>
                        <span className={styles.optionDescription}>
                          Mang sách đến trả trực tiếp tại một trong các chi nhánh thư viện
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className={styles.deliveryOption}>
                    <input
                      type="radio"
                      id="online-return"
                      name="returnMethod"
                      value="online"
                      checked={returnMethod === "online"}
                      onChange={(e) => handleReturnMethodChange(e.target.value)}
                    />
                    <label htmlFor="online-return">
                      <div className={styles.methodIcon}>
                        <Truck size={24} />
                      </div>
                      <div className={styles.methodInfo}>
                        <span className={styles.optionTitle}>Trả online</span>
                        <span className={styles.optionDescription}>
                          Shipper sẽ đến địa chỉ của bạn để lấy sách và hoàn tiền
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Thông tin trả tại thư viện */}
                {returnMethod === "library" && (
                  <div className={styles.deliverySection}>
                    <div className={styles.formGroup}>
                      <label htmlFor="branchId">Địa điểm trả sách</label>
                      <select
                        id="branchId"
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleInputChange}
                      >
                        <option value={1}>
                          Thư viện tòa A11 cơ sở 1 Đại Học Công Nghiệp Hà nội, Minh Khai, Bắc Từ Liêm Hà Nội
                        </option>
                        <option value={2}>
                          Thư viện tòa C3 cơ sở 3 Đại Học Công Nghiệp Hà nội, Phủ lý, Hà Nam
                        </option>
                      </select>
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

                    <h3>Phương thức hoàn tiền</h3>
                    <div className={styles.refundMethods}>
                      <div className={styles.refundOption}>
                        <input
                          type="radio"
                          id="bank-refund"
                          name="refundMethod"
                          value="bank"
                          checked={formData.refundMethod === "bank"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="bank-refund">
                          <span className={styles.refundTitle}>Chuyển khoản ngân hàng</span>
                          <span className={styles.refundDescription}>Hoàn tiền vào tài khoản ngân hàng (1-2 ngày làm việc)</span>
                        </label>
                      </div>

                      <div className={styles.refundOption}>
                        <input
                          type="radio"
                          id="wallet-refund"
                          name="refundMethod"
                          value="wallet"
                          checked={formData.refundMethod === "wallet"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="wallet-refund">
                          <span className={styles.refundTitle}>Ví điện tử</span>
                          <span className={styles.refundDescription}>Hoàn tiền vào ví trong app (ngay lập tức)</span>
                        </label>
                      </div>

                      <div className={styles.refundOption}>
                        <input
                          type="radio"
                          id="cash-refund"
                          name="refundMethod"
                          value="cash"
                          checked={formData.refundMethod === "cash"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="cash-refund">
                          <span className={styles.refundTitle}>Tiền mặt</span>
                          <span className={styles.refundDescription}>Nhận tiền mặt tại thư viện khi trả sách</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

                  <div className={styles.formGroup}>
                    <label htmlFor="street" className={styles.formLabel}>
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={errors.street ? styles.errorInput : ""}
                    />
                    {errors.street && <span className={styles.errorMessage}>{errors.street}</span>}
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

                  <div className={styles.formGroup}>
                    <label htmlFor="notes" className={styles.formLabel}>
                      Ghi chú (không bắt buộc)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className={styles.textArea}
                      placeholder="Thông tin thêm về việc lấy sách..."
                    />
                  </div>
                </div>
              )}

              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Xác nhận trả sách</h2>
                <div className={styles.confirmationNote}>
                  <p>
                    Bạn đang trả {sampleReturnData.items.length} cuốn sách. Vui lòng kiểm tra lại thông tin trước khi
                    xác nhận.
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
              {sampleReturnData.items.map((item) => {
                const status = getStatusDisplay(item.itemStatus)
                return (
                  <div key={item.id} className={styles.bookItem}>
                    <img src={item.imageUrl || "/placeholder.svg"} alt={item.bookName} className={styles.bookImage} />
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{item.bookName}</h3>
                      <div className={styles.bookDates}>
                        <div className={styles.dateItem}>
                          <span className={styles.dateLabel}>Ngày thuê:</span>
                          <span className={styles.dateValue}>{formatDate(item.rentalDate)}</span>
                        </div>
                        <div className={styles.dateItem}>
                          <span className={styles.dateLabel}>Số lượng:</span>
                          <span className={styles.dateValue}>{item.quantity}</span>
                        </div>
                      </div>
                      <div className={`${styles.bookStatus} ${status.className}`}>
                        {status.icon}
                        <span>{status.text}</span>
                      </div>
                      {item.itemStatus === "overdue" && (
                        <div className={styles.overdueFee}>
                          <span>Phí phạt quá hạn:</span>
                          <span>{(item.rentalPrice * 0.5).toLocaleString("vi-VN")}đ</span>
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
                  <strong>Lưu ý:</strong> Tiền hoàn trả sẽ được chuyển về tài khoản của bạn sau khi kiểm tra tình trạng
                  sách.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnBooks