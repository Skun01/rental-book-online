"use client"

import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react"
import styles from "./OrderSuccessPage.module.css"

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state

  // Redirect to home if no order data
  useEffect(() => {
    if (!orderData) {
      navigate("/", { replace: true })
    }
  }, [orderData, navigate])

  if (!orderData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Đang chuyển hướng...</p>
      </div>
    )
  }

  const { orderId, orderDate, deliveryMethod, paymentMethod, totalRental, totalDeposit, shippingFee, totalPayment } =
    orderData

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

  // Cập nhật hàm getPaymentMethodText để phù hợp với các giá trị ENUM trong database
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
      case "pickup":
        return "Nhận tại thư viện"
      case "delivery":
        return "Giao hàng tận nơi"
      default:
        return method
    }
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>

          <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
          <p className={styles.successMessage}>
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>

          <div className={styles.orderInfo}>
            <div className={styles.orderDetail}>
              <span className={styles.detailLabel}>Mã đơn hàng:</span>
              <span className={styles.detailValue}>#{orderId}</span>
            </div>

            <div className={styles.orderDetail}>
              <span className={styles.detailLabel}>Ngày đặt hàng:</span>
              <span className={styles.detailValue}>{formatDate(orderDate)}</span>
            </div>

            <div className={styles.orderDetail}>
              <span className={styles.detailLabel}>Phương thức nhận hàng:</span>
              <span className={styles.detailValue}>{getDeliveryMethodText(deliveryMethod)}</span>
            </div>

            <div className={styles.orderDetail}>
              <span className={styles.detailLabel}>Phương thức thanh toán:</span>
              <span className={styles.detailValue}>{getPaymentMethodText(paymentMethod)}</span>
            </div>
          </div>

          <div className={styles.paymentSummary}>
            <div className={styles.summaryRow}>
              <span>Tổng tiền thuê:</span>
              <span>{totalRental.toLocaleString("vi-VN")}đ</span>
            </div>

            {shippingFee > 0 && (
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Tổng thanh toán:</span>
              <span>{totalPayment.toLocaleString("vi-VN")}đ</span>
            </div>

            <div className={styles.depositInfo}>
              <p>
                Tiền đặt cọc: <strong>{totalDeposit.toLocaleString("vi-VN")}đ</strong>
              </p>
              <p>(Tiền đặt cọc sẽ được hoàn trả khi bạn trả sách đúng hạn và sách không bị hư hỏng)</p>
            </div>
          </div>

          <div className={styles.nextSteps}>
            <h2 className={styles.nextStepsTitle}>Các bước tiếp theo</h2>

            {paymentMethod === "bank-transfer" && (
              <div className={styles.bankInfo}>
                <p className={styles.bankInfoTitle}>Thông tin chuyển khoản:</p>
                <p>
                  Ngân hàng: <strong>Vietcombank</strong>
                </p>
                <p>
                  Số tài khoản: <strong>1234567890</strong>
                </p>
                <p>
                  Chủ tài khoản: <strong>CÔNG TY TNHH BOOK RENTAL</strong>
                </p>
                <p>
                  Nội dung chuyển khoản: <strong>#{orderId}</strong>
                </p>
                <p className={styles.bankInfoNote}>Vui lòng chuyển khoản trong vòng 24 giờ để đơn hàng được xử lý.</p>
              </div>
            )}

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
    </div>
  )
}

export default OrderSuccessPage
