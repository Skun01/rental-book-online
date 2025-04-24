"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, Home, CreditCard, Wallet } from "lucide-react"
import { mockOrders } from "../../../mockData"
import { useToast } from "../../../contexts/ToastContext"
import styles from "./OrderDetailsPage.module.css"

const OrderDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [extendDuration, setExtendDuration] = useState(7) // Default 7 days
  const [returnCondition, setReturnCondition] = useState("good") // Default good condition
  const [processingAction, setProcessingAction] = useState(false) // Thêm state để theo dõi trạng thái xử lý

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchOrder = () => {
      try {
        const foundOrder = mockOrders.find((o) => o.id === Number.parseInt(id))

        if (!foundOrder) {
          navigate("/orders")
          return
        }

        setOrder(ensureOrderProperties(foundOrder))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, navigate])

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <Clock size={20} className={styles.activeIcon} />
      case "RETURNED":
        return <CheckCircle size={20} className={styles.completedIcon} />
      case "PENDING":
        return <Clock size={20} className={styles.pendingIcon} />
      case "REJECTED":
        return <XCircle size={20} className={styles.cancelledIcon} />
      default:
        return <Clock size={20} className={styles.pendingIcon} />
    }
  }

  // Cập nhật hàm getStatusText để phù hợp với các giá trị ENUM trong database
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận"
      case "APPROVED":
        return "Đã xác nhận"
      case "REJECTED":
        return "Đã hủy"
      case "RETURNED":
        return "Đã trả"
      default:
        return status
    }
  }

  const getDeliveryMethodIcon = (method) => {
    switch (method) {
      case "Pickup":
        return <Home size={20} />
      case "Delivery":
        return <Truck size={20} />
      default:
        return null
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "CASH":
        return <CreditCard size={20} />
      case "CARD":
        return <CreditCard size={20} />
      case "MOMO":
        return <Wallet size={20} />
      default:
        return null
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Đảm bảo các thuộc tính cần thiết tồn tại
  const ensureOrderProperties = (order) => {
    if (!order.total_rental_price) {
      order.total_rental_price = order.total_price
    }
    return order
  }

  const handleExtendRental = () => {
    setShowExtendModal(true)
  }

  const handleReturnBooks = () => {
    setShowReturnModal(true)
  }

  const confirmExtendRental = () => {
    // Hiển thị trạng thái đang xử lý
    setProcessingAction(true)

    // Mô phỏng gọi API để gia hạn thuê sách
    setTimeout(() => {
      // In a real app, this would be an API call to extend the rental
      const newDueDate = new Date(order.due_date)
      newDueDate.setDate(newDueDate.getDate() + extendDuration)

      // Update the order in our state
      setOrder({
        ...order,
        due_date: newDueDate.toISOString(),
      })

      setShowExtendModal(false)
      setProcessingAction(false)

      showToast({
        type: "success",
        message: `Đã gia hạn thuê sách thêm ${extendDuration} ngày!`,
      })

      // Hiển thị thông tin chi tiết về việc gia hạn
      setTimeout(() => {
        showToast({
          type: "info",
          message: `Phí gia hạn ${(order.total_price * (extendDuration / 14)).toLocaleString("vi-VN")}đ đã được ghi nhận.`,
        })
      }, 500)
    }, 1500)
  }

  // Cập nhật hàm confirmReturnBooks để sử dụng giá trị ENUM đúng và thêm xử lý chi tiết
  const confirmReturnBooks = () => {
    // Hiển thị trạng thái đang xử lý
    setProcessingAction(true)

    // Mô phỏng gọi API để trả sách
    setTimeout(() => {
      const returnDate = new Date().toISOString()

      // Tính toán số tiền cọc được hoàn trả dựa trên tình trạng sách
      let depositRefund = order.deposit_price
      let refundMessage = "Toàn bộ tiền đặt cọc sẽ được hoàn trả trong 3-5 ngày làm việc."

      if (returnCondition === "damaged") {
        depositRefund = order.deposit_price * 0.7
        refundMessage = `${(order.deposit_price * 0.7).toLocaleString("vi-VN")}đ (70% tiền đặt cọc) sẽ được hoàn trả trong 3-5 ngày làm việc.`
      } else if (returnCondition === "lost") {
        depositRefund = 0
        refundMessage = "Tiền đặt cọc sẽ không được hoàn trả do sách bị mất."
      }

      // Update the order in our state
      setOrder({
        ...order,
        order_status: "RETURNED",
        return_date: returnDate,
        items: order.items.map((item) => ({
          ...item,
          status: "RETURNED",
        })),
      })

      setShowReturnModal(false)
      setProcessingAction(false)

      showToast({
        type: "success",
        message: "Đã xác nhận trả sách thành công!",
      })

      // Hiển thị thông tin về tiền đặt cọc
      setTimeout(() => {
        showToast({
          type: "info",
          message: refundMessage,
        })
      }, 500)
    }, 1500)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className={styles.orderDetailsPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <Link to="/orders" className={styles.backButton}>
            <ArrowLeft size={18} />
            <span>Quay lại đơn hàng</span>
          </Link>
          <h1 className={styles.pageTitle}>Chi tiết đơn hàng #{order.id}</h1>
        </div>

        <div className={styles.orderContent}>
          <div className={styles.orderInfo}>
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Thông tin đơn hàng</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Mã đơn hàng:</span>
                    <span className={styles.infoValue}>#{order.id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ngày đặt hàng:</span>
                    <span className={styles.infoValue}>{formatDate(order.rental_date)}</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ngày hẹn trả:</span>
                    <span className={styles.infoValue}>{formatDate(order.due_date)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ngày trả thực tế:</span>
                    <span className={styles.infoValue}>{formatDate(order.return_date)}</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Trạng thái:</span>
                    <div className={styles.statusBadge}>
                      {getStatusIcon(order.order_status)}
                      <span>{getStatusText(order.order_status)}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Trạng thái thanh toán:</span>
                    <span className={styles.infoValue}>
                      {order.payment_status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Phương thức giao hàng & thanh toán</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.methodItem}>
                  <div className={styles.methodIcon}>{getDeliveryMethodIcon(order.delivery_method)}</div>
                  <div className={styles.methodInfo}>
                    <h3 className={styles.methodTitle}>Phương thức nhận hàng</h3>
                    <p className={styles.methodValue}>
                      {order.delivery_method === "Pickup" ? "Nhận tại thư viện" : "Giao hàng tận nơi"}
                    </p>
                  </div>
                </div>

                <div className={styles.methodItem}>
                  <div className={styles.methodIcon}>{getPaymentMethodIcon(order.payment_method)}</div>
                  <div className={styles.methodInfo}>
                    <h3 className={styles.methodTitle}>Phương thức thanh toán</h3>
                    <p className={styles.methodValue}>{getPaymentMethodText(order.payment_method)}</p>
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Ghi chú</h2>
                </div>
                <div className={styles.cardContent}>
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Tóm tắt đơn hàng</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.orderItems}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{item.book_title}</h3>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemQuantity}>Số lượng: {item.quantity}</span>
                          <span className={styles.itemStatus}>Trạng thái: {getStatusText(item.status)}</span>
                        </div>
                      </div>
                      <div className={styles.itemPrices}>
                        <div className={styles.itemPrice}>
                          <span className={styles.priceLabel}>Giá thuê:</span>
                          <span className={styles.priceValue}>{item.total_price.toLocaleString("vi-VN")}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Tổng tiền thuê:</span>
                    <span>{order.total_price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Tổng tiền đặt cọc:</span>
                    <span>{order.deposit_price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  {order.late_fee > 0 && (
                    <div className={styles.summaryRow}>
                      <span>Phí trả muộn:</span>
                      <span>{order.late_fee.toLocaleString("vi-VN")}đ</span>
                    </div>
                  )}
                  <div className={styles.summaryTotal}>
                    <span>Tổng thanh toán:</span>
                    <span>{order.total_price.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                {order.order_status === "APPROVED" && (
                  <div className={styles.orderActions}>
                    <button className={styles.extendButton} onClick={handleExtendRental} disabled={processingAction}>
                      {processingAction ? "Đang xử lý..." : "Gia hạn thuê sách"}
                    </button>
                    <button className={styles.returnButton} onClick={handleReturnBooks} disabled={processingAction}>
                      {processingAction ? "Đang xử lý..." : "Trả sách"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extend Rental Modal */}
      {showExtendModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Gia hạn thuê sách</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowExtendModal(false)}
                disabled={processingAction}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Vui lòng chọn thời gian gia hạn:</p>
              <div className={styles.extendOptions}>
                <label className={styles.extendOption}>
                  <input
                    type="radio"
                    name="extendDuration"
                    value="7"
                    checked={extendDuration === 7}
                    onChange={() => setExtendDuration(7)}
                    disabled={processingAction}
                  />
                  <span>7 ngày</span>
                </label>
                <label className={styles.extendOption}>
                  <input
                    type="radio"
                    name="extendDuration"
                    value="14"
                    checked={extendDuration === 14}
                    onChange={() => setExtendDuration(14)}
                    disabled={processingAction}
                  />
                  <span>14 ngày</span>
                </label>
                <label className={styles.extendOption}>
                  <input
                    type="radio"
                    name="extendDuration"
                    value="30"
                    checked={extendDuration === 30}
                    onChange={() => setExtendDuration(30)}
                    disabled={processingAction}
                  />
                  <span>30 ngày</span>
                </label>
              </div>
              <div className={styles.extendFee}>
                <p>Phí gia hạn: {(order.total_price * (extendDuration / 14)).toLocaleString("vi-VN")}đ</p>
                <p className={styles.extendNote}>
                  Lưu ý: Phí gia hạn sẽ được tính dựa trên giá thuê ban đầu và thời gian gia hạn. Sau khi xác nhận, bạn
                  sẽ nhận được email xác nhận và hướng dẫn thanh toán.
                </p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowExtendModal(false)}
                disabled={processingAction}
              >
                Hủy
              </button>
              <button className={styles.confirmButton} onClick={confirmExtendRental} disabled={processingAction}>
                {processingAction ? "Đang xử lý..." : "Xác nhận gia hạn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Books Modal */}
      {showReturnModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Trả sách</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowReturnModal(false)}
                disabled={processingAction}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Vui lòng chọn tình trạng sách khi trả:</p>
              <div className={styles.returnOptions}>
                <label className={styles.returnOption}>
                  <input
                    type="radio"
                    name="returnCondition"
                    value="good"
                    checked={returnCondition === "good"}
                    onChange={() => setReturnCondition("good")}
                    disabled={processingAction}
                  />
                  <span>Tốt (Hoàn trả đầy đủ tiền đặt cọc)</span>
                </label>
                <label className={styles.returnOption}>
                  <input
                    type="radio"
                    name="returnCondition"
                    value="damaged"
                    checked={returnCondition === "damaged"}
                    onChange={() => setReturnCondition("damaged")}
                    disabled={processingAction}
                  />
                  <span>Hư hỏng nhẹ (Khấu trừ 30% tiền đặt cọc)</span>
                </label>
                <label className={styles.returnOption}>
                  <input
                    type="radio"
                    name="returnCondition"
                    value="lost"
                    checked={returnCondition === "lost"}
                    onChange={() => setReturnCondition("lost")}
                    disabled={processingAction}
                  />
                  <span>Mất sách (Không hoàn trả tiền đặt cọc)</span>
                </label>
              </div>
              <div className={styles.returnNote}>
                <p>Lưu ý: Sau khi xác nhận, nhân viên sẽ kiểm tra và xác nhận tình trạng sách.</p>
                <p>Tiền đặt cọc sẽ được hoàn trả trong vòng 3-5 ngày làm việc sau khi xác nhận.</p>
                <p>Nếu sách bị hư hỏng hoặc mất, tiền đặt cọc sẽ bị khấu trừ theo quy định.</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowReturnModal(false)}
                disabled={processingAction}
              >
                Hủy
              </button>
              <button className={styles.confirmButton} onClick={confirmReturnBooks} disabled={processingAction}>
                {processingAction ? "Đang xử lý..." : "Xác nhận trả sách"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsPage
