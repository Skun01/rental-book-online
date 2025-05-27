import styles from "../../../pages/adminPages/orderManager/OrderManager.module.css"
import {Calendar, MapPin, CreditCard,  User, BookOpen} from "lucide-react"

const OrderDetailModal = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: "Tiền mặt",
      CARD: "Thẻ ngân hàng",
      MOMO: "Ví MoMo",
    }
    return methods[method] || method
  }

  const getDeliveryMethodText = (method) => {
    const methods = {
      "library-pickup": "Nhận tại thư viện",
      "home-delivery": "Giao hàng tận nơi",
    }
    return methods[method] || method
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng #{order.orderId}</h2>
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
                <span className={styles.infoValue}>{order.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{order.customerEmail}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{order.customerPhone}</span>
              </div>
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
                <span className={styles.infoLabel}>Ngày đặt:</span>
                <span className={styles.infoValue}>{formatDate(order.orderDate)}</span>
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
          {order.deliveryMethod === "home-delivery" && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <MapPin size={18} />
                Địa chỉ giao hàng
              </h3>
              <p className={styles.addressText}>{order.address}</p>
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
                    <img src={item.cover_image || "/placeholder.svg"} alt={item.title} />
                    {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{item.title}</h4>
                    <p>{item.author}</p>
                    <div className={styles.itemDetails}>
                      <span>Thời gian thuê: {item.rent_day} ngày</span>
                      <span>Giá thuê: {item.rental_price.toLocaleString("vi-VN")}đ/ngày</span>
                      <span>Tiền cọc: {item.deposit_price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {(item.rental_price * item.quantity * item.rent_day).toLocaleString("vi-VN")}đ
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
                <span>{order.totalRental.toLocaleString("vi-VN")}đ</span>
              </div>
              {order.shippingFee > 0 && (
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>Tổng thanh toán:</span>
                <span>{order.totalPayment.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className={styles.depositInfo}>
                <span>Tiền đặt cọc:</span>
                <span>{order.totalDeposit.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal;