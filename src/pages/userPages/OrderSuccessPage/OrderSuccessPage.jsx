import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, MapPin, CreditCard, AlertTriangle, X,
  Loader2, Truck, XCircle, HelpCircle, Check, DollarSign, RotateCcw, Clock} from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import { useToast } from "../../../contexts/ToastContext"
import axios from "axios"
import styles from "./OrderSuccessPage.module.css"

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Get order ID from URL params or location state
  const orderId = searchParams.get("orderId") || location.state?.orderId

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        // Use sample data if no order ID
        setOrderData(getSampleOrderData())
        setLoading(false)
        return
      }

      try {
        const bearer = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:8080/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `${bearer}`,
          },
        })
        setOrderData(response.data.data)
      } catch (error) {
        console.error("Error fetching order details:", error)
        // Fallback to sample data
        setOrderData(getSampleOrderData())
        showToast({ type: "error", message: "Không thể tải thông tin đơn hàng, hiển thị dữ liệu mẫu" })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  // Sample data that matches API response structure
  const getSampleOrderData = () => ({
    id: 12345,
    totalPrice: 430000,
    depositPrice: 320000,
    city: "Hà Nội",
    district: "Bắc Từ Liêm",
    ward: "Minh Khai",
    street: "123 Đường ABC",
    notes: "Giao hàng vào buổi chiều",
    orderStatus: "PROCESSING", // Processing, Confirmed, Delivering, Cancelled
    paymentStatus: "PAID", // Unpaid, Partial, Paid, Refunded
    paymentMethod: "E_WALLET", // Cash, BankTransfer, EWallet
    userId: currentUser?.id || 1,
    items: [
      {
        id: 1,
        bookId: 101,
        bookTitle: "Đắc Nhân Tâm",
        bookAuthor: "Dale Carnegie",
        bookImage: "/auth.jpg",
        quantity: 2,
        rentedDay: 14,
        rentalPrice: 25000,
        depositPrice: 100000,
      },
      {
        id: 2,
        bookId: 102,
        bookTitle: "Nhà Giả Kim",
        bookAuthor: "Paulo Coelho",
        bookImage: "/auth.jpg",
        quantity: 1,
        rentedDay: 21,
        rentalPrice: 30000,
        depositPrice: 120000,
      },
    ],
    createAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    createBy: "user",
    updateBy: "user",
  })

  // Get status info with correct statuses
  const getStatusInfo = (status) => {
    const statusMap = {
      PROCESSING: { class: "processing", text: "Đang xử lý", icon: <Clock size={16} />, canCancel: true },
      CONFIRMED: { class: "confirmed", text: "Đã xác nhận", icon: <Check size={16} />, canCancel: false },
      DELIVERING: { class: "delivering", text: "Đang giao hàng", icon: <Truck size={16} />, canCancel: false },
      CANCELLED: { class: "cancelled", text: "Đã hủy", icon: <XCircle size={16} />, canCancel: false },
    }
    return statusMap[status] || { class: "unknown", text: status, icon: <HelpCircle size={16} />, canCancel: false }
  }

  // Get payment status info
  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      UNPAID: { class: "unpaid", text: "Chưa thanh toán", icon: <CreditCard size={16} /> },
      PARTIAL: { class: "partial", text: "Thanh toán một phần", icon: <DollarSign size={16} /> },
      PAID: { class: "paid", text: "Đã thanh toán", icon: <Check size={16} /> },
      REFUNDED: { class: "refunded", text: "Đã hoàn tiền", icon: <RotateCcw size={16} /> },
    }
    return statusMap[status] || { class: "unknown", text: status, icon: <HelpCircle size={16} /> }
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
    const methodMap = {
      CASH: "Tiền mặt",
      BANK_TRANSFER: "Chuyển khoản ngân hàng",
      E_WALLET: "Ví điện tử",
    }
    return methodMap[method] || method
  }

  const getDeliveryMethodText = (order) => {
    // Check if it's library pickup (no address details)
    if (!order.city && !order.district && !order.ward && !order.street) {
      return "Nhận tại thư viện"
    }
    return "Giao hàng tận nơi"
  }

  // Calculate estimated delivery date
  const getEstimatedDeliveryDate = (order) => {
    const orderDate = new Date(order.createAt)
    const isLibraryPickup = !order.city && !order.district && !order.ward && !order.street

    if (isLibraryPickup) {
      orderDate.setDate(orderDate.getDate() + 2) // 2 days for library pickup
    } else {
      orderDate.setDate(orderDate.getDate() + 3) // 3 days for home delivery
    }

    return orderDate.toISOString()
  }

  // Handle order cancellation
  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      const bearer = localStorage.getItem("token")
      await axios.put(
        `http://localhost:8080/api/v1/orders/${orderData.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `${bearer}`,
          },
        },
      )

      // Update order status locally
      setOrderData((prev) => ({
        ...prev,
        orderStatus: "CANCELLED",
      }))

      showToast({ type: "success", message: "Đơn hàng đã được hủy thành công" })
      setShowCancelModal(false)
    } catch (error) {
      console.error("Error cancelling order:", error)
      showToast({ type: "error", message: "Không thể hủy đơn hàng. Vui lòng thử lại." })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.successPage}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loading}></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className={styles.successPage}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>
                <AlertTriangle size={64} color="#ef4444" />
              </div>
              <h1 className={styles.successTitle}>Không tìm thấy đơn hàng</h1>
              <p className={styles.successMessage}>Đơn hàng không tồn tại hoặc đã bị xóa.</p>
            </div>
            <div className={styles.actionButtons}>
              <Link to="/" className={styles.continueShoppingButton}>
                <span>Về trang chủ</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(orderData.orderStatus)
  const paymentInfo = getPaymentStatusInfo(orderData.paymentStatus)
  const isLibraryPickup = !orderData.city && !orderData.district && !orderData.ward && !orderData.street

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successHeader}>
            <div className={styles.successIcon}>
              {orderData.orderStatus === "CANCELLED" ? <X size={64} color="#ef4444" /> : <CheckCircle size={64} />}
            </div>
            <h1 className={styles.successTitle}>
              {orderData.orderStatus === "CANCELLED" ? "Đơn hàng đã bị hủy" : "Đặt hàng thành công!"}
            </h1>
            <p className={styles.successMessage}>
              {orderData.orderStatus === "CANCELLED"
                ? "Đơn hàng của bạn đã được hủy. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc."
                : "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý."}
            </p>
          </div>

          <div className={styles.orderInfoSection}>
            <div className={styles.orderHeaderWithActions}>
              <h2 className={styles.sectionTitle}>Thông tin đơn hàng</h2>
              {statusInfo.canCancel && orderData.orderStatus !== "CANCELLED" && (
                <button className={styles.cancelButton} onClick={() => setShowCancelModal(true)} disabled={cancelling}>
                  {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                </button>
              )}
            </div>

            <div className={styles.orderInfo}>
              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <ShoppingBag size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Mã đơn hàng</span>
                  <span className={styles.detailValue}>#{orderData.id}</span>
                </div>
              </div>

              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <Calendar size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Ngày đặt hàng</span>
                  <span className={styles.detailValue}>{formatDate(orderData.createAt)}</span>
                </div>
              </div>

              <div className={styles.orderInfoCard}>
                <div className={styles.orderInfoIcon}>
                  <MapPin size={24} />
                </div>
                <div className={styles.orderDetail}>
                  <span className={styles.detailLabel}>Phương thức nhận hàng</span>
                  <span className={styles.detailValue}>{getDeliveryMethodText(orderData)}</span>
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

            {/* Order Status */}
            <div className={styles.statusSection}>
              <div className={styles.statusBadges}>
                <div className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
                  <span className={styles.statusIcon}>{statusInfo.icon}</span>
                  <span>{statusInfo.text}</span>
                </div>
                <div className={`${styles.statusBadge} ${styles[paymentInfo.class]}`}>
                  <span className={styles.statusIcon}>{paymentInfo.icon}</span>
                  <span>{paymentInfo.text}</span>
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
                    <img src={item.bookImage || "/auth.jpg"} alt={item.bookTitle} className={styles.itemThumbnail} />
                    {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.bookTitle}</h3>
                    <p className={styles.itemAuthor}>{item.bookAuthor}</p>
                    <div className={styles.itemRentDetails}>
                      <span className={styles.itemRentDays}>Thời gian thuê: {item.rentedDay} ngày</span>
                    </div>
                    <div className={styles.itemPrice}>
                      {(item.rentalPrice * item.quantity * Math.floor(item.rentedDay / 7)).toLocaleString("vi-VN")}đ
                      <span className={styles.depositAmount}>
                        {" "}
                        (Tiền cọc: {(item.depositPrice * item.quantity).toLocaleString("vi-VN")}đ)
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
                <span>Tổng phí thuê:</span>
                <span>{(orderData.totalPrice - orderData.depositPrice).toLocaleString("vi-VN")}đ</span>
              </div>

              {!isLibraryPickup && (
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
              )}

              <div className={styles.summaryTotal}>
                <span>Tổng thanh toán:</span>
                <span>{orderData.totalPrice.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.depositInfo}>
                <div className={styles.depositHeader}>
                  <span>Tiền đặt cọc:</span>
                  <span>{orderData.depositPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <p className={styles.depositNote}>
                  Tiền đặt cọc sẽ được hoàn trả khi bạn trả sách đúng hạn và sách không bị hư hỏng
                </p>
              </div>
            </div>
          </div>

          <div className={styles.deliveryInfoSection}>
            <h2 className={styles.sectionTitle}>{isLibraryPickup ? "Thông tin nhận sách" : "Thông tin giao hàng"}</h2>
            <div className={styles.deliveryInfo}>
              {isLibraryPickup ? (
                <>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Địa điểm nhận:</span>
                    <span className={styles.deliveryValue}>Thư viện Đại học Công nghiệp Hà Nội</span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Địa chỉ:</span>
                    <span className={styles.deliveryValue}>Tòa A11, Cơ sở 1, Minh Khai, Bắc Từ Liêm, Hà Nội</span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Thời gian mở cửa:</span>
                    <span className={styles.deliveryValue}>Thứ 2 - Thứ 6: 8:00 - 17:30</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Địa chỉ giao hàng:</span>
                    <span className={styles.deliveryValue}>
                      {orderData.street}, {orderData.ward}, {orderData.district}, {orderData.city}
                    </span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Ngày dự kiến giao hàng:</span>
                    <span className={styles.deliveryValue}>{formatDate(getEstimatedDeliveryDate(orderData))}</span>
                  </div>
                </>
              )}

              {orderData.notes && (
                <div className={styles.deliveryDetail}>
                  <span className={styles.deliveryLabel}>Ghi chú:</span>
                  <span className={styles.deliveryValue}>{orderData.notes}</span>
                </div>
              )}
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

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className={styles.modal} onClick={() => setShowCancelModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận hủy đơn hàng</h3>
              <button className={styles.modalCloseButton} onClick={() => setShowCancelModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Bạn có chắc chắn muốn hủy đơn hàng #{orderData.id}?</p>
              <p className={styles.cancelWarning}>
                Hành động này không thể hoàn tác. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelConfirmButton} onClick={handleCancelOrder} disabled={cancelling}>
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
              <button
                className={styles.cancelBackButton}
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderSuccessPage