import styles from "../../../pages/adminPages/orderManager/OrderManager.module.css"
import {Calendar, MapPin, CreditCard, User, BookOpen} from "lucide-react"

const OrderDetailModal = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Ngày không hợp lệ";
    }
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      Cash: "Tiền mặt",
      Card: "Thẻ ngân hàng", 
      MoMo: "Ví MoMo",
    }
    return methods[method] || method
  }

  const getDeliveryMethodText = (method) => {
    const methods = {
      Offline: "Nhận tại thư viện",
      Online: "Giao hàng tận nơi",
    }
    return methods[method] || method
  }

  const getOrderStatusText = (status) => {
    const statuses = {
      Processing: "Đang xử lý",
      Confirmed: "Đã xác nhận", 
      Delivered: "Đã giao hàng",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy"
    }
    return statuses[status] || status
  }

  const getPaymentStatusText = (status) => {
    const statuses = {
      Paid: "Đã thanh toán",
      Unpaid: "Chưa thanh toán",
      Partial: "Thanh toán một phần"
    }
    return statuses[status] || status
  }

  const formatAddress = () => {
    const addressParts = [order.street, order.ward, order.district, order.city].filter(Boolean)
    return addressParts.length > 0 ? addressParts.join(", ") : "Không có thông tin địa chỉ"
  }

  const calculateRentalDays = (rentalDate, returnDate) => {
    if (!rentalDate || !returnDate) return 0;
    const start = new Date(rentalDate)
    const end = new Date(returnDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng #{order.id}</h2>
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
                <span className={styles.infoValue}>{order.fullName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{order.phone}</span>
              </div>
              {order.notes && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ghi chú:</span>
                  <span className={styles.infoValue}>{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <Calendar size={18} />
              Thông tin đơn hàng
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày tạo:</span>
                <span className={styles.infoValue}>{formatDate(order.createAt)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày nhận:</span>
                <span className={styles.infoValue}>{formatDate(order.receiveDay)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Trạng thái đơn hàng:</span>
                <span className={styles.infoValue}>{getOrderStatusText(order.orderStatus)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Trạng thái thanh toán:</span>
                <span className={styles.infoValue}>{getPaymentStatusText(order.paymentStatus)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phương thức thanh toán:</span>
                <span className={styles.infoValue}>{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phương thức giao hàng:</span>
                <span className={styles.infoValue}>{getDeliveryMethodText(order.deliveryMethod)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryMethod === "Online" && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <MapPin size={18} />
                Địa chỉ giao hàng
              </h3>
              <p className={styles.addressText}>{formatAddress()}</p>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <BookOpen size={18} />
              Sách đã thuê
            </h3>
            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img src={item.imageUrl || "/placeholder.svg"} alt={item.bookName} />
                    {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{item.bookName}</h4>
                    <div className={styles.itemDetails}>
                      <span>Ngày thuê: {formatDate(item.rentalDate)}</span>
                      <span>Ngày trả: {formatDate(item.returnDate)}</span>
                      <span>
                        Thời gian thuê: {calculateRentalDays(item.rentalDate, item.returnDate)} ngày
                      </span>
                      <span>Giá thuê: {item.rentalPrice.toLocaleString("vi-VN")}đ</span>
                      <span>Tiền cọc: {item.depositPrice.toLocaleString("vi-VN")}đ</span>
                      <span>Số lượng: {item.quantity}</span>
                      <span>Trạng thái: {item.status === 'Rented' ? 'Đang thuê' : 'Đang xử lý'}</span>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {item.totalRental.toLocaleString("vi-VN")}đ
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
                <span>Tổng tiền thuê:</span>
                <span>{order.totalPrice.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tổng tiền cọc:</span>
                <span>{order.depositPrice.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Tổng thanh toán:</span>
                <span>{(order.totalPrice + order.depositPrice).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal;