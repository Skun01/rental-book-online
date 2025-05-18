"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, CreditCard, Truck, Home } from "lucide-react"
import styles from "./ReturnSuccessPage.module.css"

const ReturnSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [returnDetails, setReturnDetails] = useState(null)

  // Lấy thông tin trả sách từ state
  useEffect(() => {
    if (location.state) {
      setReturnDetails(location.state)
    } else {
      // Nếu không có thông tin, quay lại trang danh sách sách
      navigate("/rented-books")
    }
  }, [location.state, navigate])

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Format ngày giờ đầy đủ
  const formatDateTime = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  if (!returnDetails) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successHeader}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h1 className={styles.successTitle}>Đăng ký trả sách thành công!</h1>
            <p className={styles.successMessage}>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Yêu cầu trả sách của bạn đã được xác nhận.
            </p>
          </div>

          <div className={styles.returnInfoSection}>
            <h2 className={styles.sectionTitle}>Thông tin trả sách</h2>
            <div className={styles.returnInfo}>
              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  <ShoppingBag size={24} />
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Mã trả sách</span>
                  <span className={styles.detailValue}>#{returnDetails.returnId}</span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  <Calendar size={24} />
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Ngày đăng ký trả</span>
                  <span className={styles.detailValue}>{formatDateTime(returnDetails.returnDate)}</span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  {returnDetails.returnMethod === "library" ? <Home size={24} /> : <Truck size={24} />}
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Phương thức trả sách</span>
                  <span className={styles.detailValue}>
                    {returnDetails.returnMethod === "library" ? "Trả tại thư viện" : "Trả online"}
                  </span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  <CreditCard size={24} />
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Tổng tiền hoàn trả</span>
                  <span className={styles.detailValue}>{returnDetails.totalRefund.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>
          </div>

          {returnDetails.returnMethod === "online" && (
            <div className={styles.pickupInfoSection}>
              <h2 className={styles.sectionTitle}>Thông tin lấy sách</h2>
              <div className={styles.pickupInfo}>
                <div className={styles.pickupDetail}>
                  <span className={styles.pickupLabel}>Địa chỉ lấy sách:</span>
                  <span className={styles.pickupValue}>{returnDetails.address}</span>
                </div>
                <div className={styles.pickupDetail}>
                  <span className={styles.pickupLabel}>Ngày dự kiến lấy sách:</span>
                  <span className={styles.pickupValue}>{formatDate(returnDetails.estimatedPickupDate)}</span>
                </div>
                <div className={styles.pickupNote}>
                  <p>
                    Shipper sẽ đến địa chỉ của bạn trong khoảng thời gian từ 8:00 - 18:00 vào ngày dự kiến. Vui lòng
                    chuẩn bị sẵn sách và đảm bảo có người nhận.
                  </p>
                </div>
              </div>
            </div>
          )}

          {returnDetails.returnMethod === "library" && (
            <div className={styles.libraryInfoSection}>
              <h2 className={styles.sectionTitle}>Thông tin trả tại thư viện</h2>
              <div className={styles.libraryInfo}>
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
                </div>
                <div className={styles.libraryNote}>
                  <p>
                    Vui lòng mang theo thẻ thư viện hoặc CMND/CCCD khi đến trả sách. Tiền cọc sẽ được hoàn trả sau khi
                    kiểm tra sách.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.returnItemsSection}>
            <h2 className={styles.sectionTitle}>Sách trả</h2>
            <div className={styles.returnItems}>
              {returnDetails.books.map((book) => (
                <div key={book.id} className={styles.returnItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={book.cover_image || "/placeholder.svg"}
                      alt={book.title}
                      className={styles.itemThumbnail}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{book.title}</h3>
                    <p className={styles.itemAuthor}>{book.author}</p>
                    <div className={styles.itemRentDetails}>
                      <span className={styles.itemRentDays}>Thời gian thuê: {book.rental_period || "N/A"} ngày</span>
                      <div className={styles.itemDates}>
                        <span>Ngày thuê: {formatDate(book.rental_date)}</span>
                        <span>Ngày trả: {formatDate(book.due_date)}</span>
                      </div>
                    </div>
                    {book.status === "overdue" && (
                      <div className={styles.itemOverdue}>
                        <span>Quá hạn {book.overdue_days} ngày</span>
                        <span>Phí phạt: {book.overdue_fee.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.paymentSummary}>
            <h2 className={styles.sectionTitle}>Tóm tắt thanh toán</h2>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Tổng tiền cọc:</span>
                <span>{returnDetails.totalDeposit.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tổng tiền thuê:</span>
                <span>-{returnDetails.totalRental.toLocaleString("vi-VN")}đ</span>
              </div>

              {returnDetails.totalOverdueFee > 0 && (
                <div className={styles.summaryRow}>
                  <span>Phí phạt quá hạn:</span>
                  <span>-{returnDetails.totalOverdueFee.toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              <div className={styles.summaryTotal}>
                <span>Tổng tiền hoàn trả:</span>
                <span>{returnDetails.totalRefund.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.refundInfo}>
                {returnDetails.returnMethod === "library" ? (
                  <p>
                    Tiền hoàn trả sẽ được thanh toán cho bạn khi bạn trả sách tại thư viện sau khi kiểm tra tình trạng
                    sách.
                  </p>
                ) : (
                  <p>
                    Tiền hoàn trả sẽ được chuyển vào tài khoản của bạn trong vòng 3-5 ngày làm việc sau khi chúng tôi
                    nhận được và kiểm tra sách.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link to="/rented-books" className={styles.viewBooksButton}>
              <ShoppingBag size={18} />
              <span>Xem sách đang thuê</span>
            </Link>

            <Link to="/" className={styles.continueButton}>
              <span>Tiếp tục tìm sách</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnSuccessPage
