"use client"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, MapPin, CreditCard } from "lucide-react"
import styles from "./OrderSuccessPage.module.css"

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Sử dụng dữ liệu từ location state hoặc dữ liệu mẫu nếu không có
  const orderData = location.state || {
    orderId: "ORD-5823",
    orderDate: new Date().toISOString(),
    items: [
      {
        id: 1,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        cover_image: "/Book.jpg",
        rental_price: 25000,
        deposit_price: 100000,
        quantity: 2,
        available_quantity: 8,
        rent_day: 20,
      },
      {
        id: 2,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover_image: "/Book.jpg",
        rental_price: 30000,
        deposit_price: 120000,
        quantity: 1,
        available_quantity: 3,
        rent_day: 14,
      },
    ],
    deliveryMethod: "home-delivery",
    pickupLocation: "",
    address: "123 Đường ABC, Quận 1, Hồ Chí Minh",
    paymentMethod: "CARD", // Có thể là "CASH", "CARD", "MOMO"
    rentalPeriod: "14 ngày",
    estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    totalRental: 80000,
    totalDeposit: 320000,
    shippingFee: 30000,
    totalPayment: 110000,
  }

  // Hàm tính tổng tiền thuê
  const getTotalPrice = () => {
    return orderData.items.reduce((total, item) => total + item.rental_price * item.quantity * item.rent_day, 0)
  }

  // Hàm tính tổng tiền đặt cọc
  const getTotalDeposit = () => {
    return orderData.items.reduce((total, item) => total + item.deposit_price * item.quantity, 0)
  }

  // Hàm xử lý ngày tháng
  const addDays = (days) => {
    const today = new Date()
    today.setDate(today.getDate() + days)
    return today.toLocaleDateString("vi-VN")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt"
      case "CARD":
        return "Thẻ ngân hàng"
      case "MOMO":
        return "Ví điện tử MoMo"
      default:
        return method
    }
  }

  const getDeliveryMethodText = (method) => {
    switch (method) {
      case "library-pickup":
        return "Nhận tại thư viện"
      case "home-delivery":
        return "Giao hàng tận nơi"
      default:
        return method
    }
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successHeader}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
            <p className={styles.successMessage}>
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
          </div>

          <div className={styles.orderInfoSection}>
            <h2 className={styles.sectionTitle}>Thông tin đơn hàng</h2>
            <div className={styles.orderInfo}>
              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <ShoppingBag size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Mã đơn hàng</span>
                  <span className={styles.detailValue}>#{orderData.orderId}</span>
                </div>
              </div>

              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <Calendar size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Ngày đặt hàng</span>
                  <span className={styles.detailValue}>{formatDate(orderData.orderDate)}</span>
                </div>
              </div>

              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <MapPin size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Phương thức nhận hàng</span>
                  <span className={styles.detailValue}>{getDeliveryMethodText(orderData.deliveryMethod)}</span>
                </div>
              </div>

              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <CreditCard size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Phương thức thanh toán</span>
                  <span className={styles.detailValue}>{getPaymentMethodText(orderData.paymentMethod)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.orderItemsSection}>
            <h2 className={styles.sectionTitle}>Sách đã thuê</h2>
            <div className={styles.orderItems}>
              {orderData.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.cover_image || "/placeholder.svg"}
                      alt={item.title}
                      className={styles.itemThumbnail}
                    />
                    {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemAuthor}>{item.author}</p>
                    <div className={styles.itemRentDetails}>
                      <span className={styles.itemRentDays}>Thời gian thuê: {item.rent_day} ngày</span>
                      <span className={styles.itemReturnDate}>Ngày trả: {addDays(item.rent_day)}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      {(item.rental_price * item.quantity * item.rent_day).toLocaleString("vi-VN")}đ
                      <span className={styles.depositAmount}>
                        {" "}
                        (Đặt cọc: {item.deposit_price.toLocaleString("vi-VN")}đ)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.paymentSummary}>
            <h2 className={styles.sectionTitle}>Tóm tắt thanh toán</h2>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Tổng tiền thuê:</span>
                <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
              </div>

              {orderData.shippingFee > 0 && (
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{orderData.shippingFee.toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              <div className={styles.summaryTotal}>
                <span>Tổng thanh toán:</span>
                <span>{(getTotalPrice() + orderData.shippingFee).toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.depositInfo}>
                <div className={styles.depositHeader}>
                  <span>Tiền đặt cọc:</span>
                  <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
                </div>
                <p className={styles.depositNote}>
                  Tiền đặt cọc sẽ được hoàn trả khi bạn trả sách đúng hạn và sách không bị hư hỏng
                </p>
              </div>
            </div>
          </div>

          <div className={styles.deliveryInfoSection}>
            <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryDetail}>
                <span className={styles.deliveryLabel}>Địa chỉ giao hàng:</span>
                <span className={styles.deliveryValue}>{orderData.address}</span>
              </div>
              <div className={styles.deliveryDetail}>
                <span className={styles.deliveryLabel}>Ngày dự kiến giao hàng:</span>
                <span className={styles.deliveryValue}>{formatDate(orderData.estimatedDeliveryDate)}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link to="/orders" className={styles.viewOrderButton}>
              <ShoppingBag size={18} />
              <span>Xem đơn hàng của tôi</span>
            </Link>

            <Link to="/" className={styles.continueShoppingButton}>
              <span>Tiếp tục tìm sách</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
