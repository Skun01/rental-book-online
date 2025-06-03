import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, MapPin, CreditCard, AlertTriangle, X,
  Truck, XCircle, HelpCircle, Check, Clock} from "lucide-react"
import { useToast } from "../../../contexts/ToastContext"
import axios from "axios"
import styles from "./OrderSuccessPage.module.css"

const OrderSuccessPage = () => {
  const { showToast } = useToast()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const {orderId} = useParams()
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const bearer = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:8080/api/v1/order/rental/${orderId}`, {
          headers: {
            Authorization: `${bearer}`,
          },
        })
        console.log(response.data.data)
        setOrderData(response.data.data)
      } catch (error) {
        console.error("Error fetching order details:", error)
        showToast({ type: "error", message: "Không thể tải thông tin đơn hàng, hiển thị dữ liệu mẫu" })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const getStatusInfo = (status) => {
    const statusMap = {
      Processing: { class: "processing", text: "Đang xử lý", icon: <Clock size={16} />, canCancel: true },
      Confirmed: { class: "confirmed", text: "Đã xác nhận", icon: <Check size={16} />, canCancel: false },
      Delivering: { class: "delivering", text: "Đang giao hàng", icon: <Truck size={16} />, canCancel: false },
      Cancelled: { class: "cancelled", text: "Đã hủy", icon: <XCircle size={16} />, canCancel: false },
    }
    return statusMap[status] || { class: "unknown", text: status, icon: <HelpCircle size={16} />, canCancel: false }
  }

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      Unpaid: { class: "unpaid", text: "Chưa thanh toán", icon: <CreditCard size={16} /> },
      Paid: { class: "paid", text: "Đã thanh toán", icon: <Check size={16} /> },
    }
    return statusMap[status] || { class: "unknown", text: status, icon: <HelpCircle size={16} /> }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getPaymentMethodText = (method) => {
    const methodMap = {
      Cash: "Tiền mặt",
      BankTransfer: "Chuyển khoản ngân hàng",
      EWallet: "Ví điện tử",
    }
    return methodMap[method] || method
  }

  const getDeliveryMethodText = (order) => {
    if (order.deliveryMethod === 'Offline') {
      return "Nhận tại thư viện"
    }
    return "Giao hàng tận nơi"
  }

  // Calculate rental days for each item
  const calculateRentalDays = (rentalDate, rentedDate) => {
    const startDate = new Date(rentalDate)
    const endDate = new Date(rentedDate)
    const timeDiff = endDate.getTime() - startDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  // Handle order cancellation
  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      const bearer = localStorage.getItem("token")
      await axios.put(
        `http://localhost:8080/api/v1/order/rental/cancel/${orderData.id}`,
        {},
        {
          headers: {
            Authorization: `${bearer}`,
          },
        },
      )
      setOrderData((prev) => ({
        ...prev,
        orderStatus: "Cancelled",
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
  const isLibraryPickup = orderData.deliveryMethod === 'Offline'

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successHeader}>
            <div className={styles.successIcon}>
              {orderData.orderStatus === "Cancelled"? 
                <X size={64} color="#ef4444" /> : <CheckCircle size={64} />}
            </div>
            <h1 className={styles.successTitle}>
              {orderData.orderStatus === "Cancelled"? 
                "Đơn hàng đã bị hủy" : "Đặt hàng thành công!"}
            </h1>
            <p className={styles.successMessage}>
              {orderData.orderStatus === "Cancelled"
                ? "Đơn hàng của bạn đã được hủy. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc."
                : "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý."}
            </p>
          </div>

          <div className={styles.orderInfoSection}>
            <div className={styles.orderHeaderWithActions}>
              <h2 className={styles.sectionTitle}>Thông tin đơn hàng</h2>
              {statusInfo.canCancel && orderData.orderStatus !== "Cancelled" && (
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
              {orderData.items.map((item) => {
                const rentalDays = calculateRentalDays(item.rentalDate, item.rentedDate)
                return (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      <img src={item.bookImage || "/auth.jpg"} alt={item.bookName} className={styles.itemThumbnail} />
                      {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.bookName}</h3>
                      <p className={styles.itemAuthor}>{item.bookAuthor || "Tác giả không xác định"}</p>
                      <div className={styles.itemRentDetails}>
                        <span className={styles.itemRentDays}>Thời gian thuê: {rentalDays} ngày</span>
                        <span className={styles.itemRentPeriod}>
                          ({formatDate(item.receiveDay || item.createAt)} - {formatDate(item.rentedDate)})
                        </span>
                      </div>
                      <div className={styles.itemPrice}>
                        {item.totalRental.toLocaleString("vi-VN")}đ
                        <span className={styles.depositAmount}>
                          {" "}
                          (Tiền cọc: {item.totalDeposit.toLocaleString("vi-VN")}đ)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
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
                    <span className={styles.deliveryLabel}>Người đến lấy sách:</span>
                    <span className={styles.deliveryValue}>{orderData.fullName}</span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Số điện thoại:</span>
                    <span className={styles.deliveryValue}>{orderData.phone}</span>
                  </div>
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
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Ngày đến nhận:</span>
                    <span className={styles.deliveryValue}>{formatDate(orderData.receiveDay)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Người nhận:</span>
                    <span className={styles.deliveryValue}>{orderData.fullName}</span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Số điện thoại:</span>
                    <span className={styles.deliveryValue}>{orderData.phone}</span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Địa chỉ giao hàng:</span>
                    <span className={styles.deliveryValue}>
                      {orderData.street}, {orderData.ward}, {orderData.district}, {orderData.city}
                    </span>
                  </div>
                  <div className={styles.deliveryDetail}>
                    <span className={styles.deliveryLabel}>Ngày dự kiến nhận hàng:</span>
                    <span className={styles.deliveryValue}>{formatDate(orderData.createAt)}</span>
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
              <span>Xem các đơn hàng</span>
            </Link>

            <Link to="/" className={styles.continueShoppingButton}>
              <span>Tiếp tục xem sách</span>
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
                Bạn sẽ được hủy đơn hàng và được hoàn tiền
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