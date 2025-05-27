import styles from "../../../pages/adminPages/returnManager/ReturnManager.module.css"
import {Calendar, MapPin, CreditCard, User, BookOpen} from "lucide-react"

const ReturnDetailModal = ({ returnItem, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getReturnMethodText = (method) => {
    const methods = {
      library: "Trả tại thư viện",
      online: "Trả online",
    }
    return methods[method] || method
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn trả sách #{returnItem.returnId}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Customer Info */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <User size={18} />
              Thông tin khách hàng
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Họ tên:</span>
                <span className={styles.infoValue}>{returnItem.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{returnItem.customerEmail}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{returnItem.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Return Info */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <Calendar size={18} />
              Thông tin trả sách
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày đăng ký trả:</span>
                <span className={styles.infoValue}>{formatDate(returnItem.returnDate)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phương thức trả:</span>
                <span className={styles.infoValue}>{getReturnMethodText(returnItem.returnMethod)}</span>
              </div>
              {returnItem.estimatedPickupDate && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày dự kiến lấy sách:</span>
                  <span className={styles.infoValue}>{formatDate(returnItem.estimatedPickupDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <Edit size={18} />
              Ghi chú của Admin
            </h3>
            <div className={styles.notesSection}>
              {returnItem.notes ? (
                <div className={styles.notesContent}>
                  <p>{returnItem.notes}</p>
                </div>
              ) : (
                <div className={styles.noNotesContent}>
                  <p>Chưa có ghi chú nào cho đơn trả sách này.</p>
                </div>
              )}
            </div>
          </div>

          {/* Address for online returns */}
          {returnItem.returnMethod === "online" && returnItem.address && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <MapPin size={18} />
                Địa chỉ lấy sách
              </h3>
              <p className={styles.addressText}>{returnItem.address}</p>
            </div>
          )}

          {/* Return Items */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <BookOpen size={18} />
              Sách trả
            </h3>
            <div className={styles.returnItems}>
              {returnItem.books.map((book) => (
                <div key={book.id} className={styles.returnItem}>
                  <div className={styles.itemImage}>
                    <img src={book.cover_image || "/placeholder.svg"} alt={book.title} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <div className={styles.itemDetails}>
                      <span>Thời gian thuê: {book.rental_period} ngày</span>
                      <span>Ngày thuê: {formatDate(book.rental_date)}</span>
                      <span>Ngày trả: {formatDate(book.due_date)}</span>
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

          {/* Payment Summary */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <CreditCard size={18} />
              Tóm tắt thanh toán
            </h3>
            <div className={styles.paymentSummary}>
              <div className={styles.summaryRow}>
                <span>Tổng tiền cọc:</span>
                <span>{returnItem.totalDeposit.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tổng tiền thuê:</span>
                <span>-{returnItem.totalRental.toLocaleString("vi-VN")}đ</span>
              </div>
              {returnItem.totalOverdueFee > 0 && (
                <div className={styles.summaryRow}>
                  <span>Phí phạt quá hạn:</span>
                  <span>-{returnItem.totalOverdueFee.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>Tổng tiền hoàn trả:</span>
                <span>{returnItem.totalRefund.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnDetailModal