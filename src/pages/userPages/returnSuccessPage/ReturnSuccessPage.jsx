import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, CreditCard, Truck, Home, User, Phone, MapPin } from "lucide-react"
import styles from "./ReturnSuccessPage.module.css"

const ReturnSuccessPage = () => {
  const { returnId } = useParams()
  const navigate = useNavigate()
  const [returnDetails, setReturnDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch return details from API
  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch(`/api/returns/${returnId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch return details')
        }
        const data = await response.json()
        setReturnDetails(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching return details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (returnId) {
      fetchReturnDetails()
    } else {
      navigate("/rented-books")
    }
  }, [returnId, navigate])

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định"
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Format ngày giờ đầy đủ
  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa xác định"
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  // Get delivery method display text
  const getDeliveryMethodText = (method) => {
    return method === "Online" ? "Trả online" : "Trả tại thư viện"
  }

  // Get order status display text
  const getOrderStatusText = (status) => {
    const statusMap = {
      'Confirmed': 'Đã xác nhận',
      'Processing': 'Đang xử lý',
      'Completed': 'Hoàn thành',
      'Cancelled': 'Đã hủy'
    }
    return statusMap[status] || status
  }

  // Get payment status display text
  const getPaymentStatusText = (status) => {
    const statusMap = {
      'Paid': 'Đã thanh toán',
      'Unpaid': 'Chưa thanh toán',
      'Refunded': 'Đã hoàn tiền'
    }
    return statusMap[status] || status
  }

  // Calculate totals
  const calculateTotals = (items) => {
    return items.reduce((totals, item) => {
      totals.totalRental += item.totalRental || 0
      totals.totalDeposit += item.totalDeposit || 0
      return totals
    }, { totalRental: 0, totalDeposit: 0 })
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Có lỗi xảy ra: {error}</p>
        <Link to="/rented-books" className={styles.backButton}>
          Quay lại danh sách sách
        </Link>
      </div>
    )
  }

  if (!returnDetails) {
    return (
      <div className={styles.errorContainer}>
        <p>Không tìm thấy thông tin trả sách</p>
        <Link to="/rented-books" className={styles.backButton}>
          Quay lại danh sách sách
        </Link>
      </div>
    )
  }

  const totals = calculateTotals(returnDetails.items || [])
  const refundAmount = totals.totalDeposit - totals.totalRental

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
                  <span className={styles.detailValue}>#{returnDetails.id}</span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  <Calendar size={24} />
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Trạng thái đơn hàng</span>
                  <span className={styles.detailValue}>{getOrderStatusText(returnDetails.orderStatus)}</span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  {returnDetails.deliveryMethod === "Online" ? <Truck size={24} /> : <Home size={24} />}
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Phương thức trả sách</span>
                  <span className={styles.detailValue}>
                    {getDeliveryMethodText(returnDetails.deliveryMethod)}
                  </span>
                </div>
              </div>

              <div className={styles.returnInfoCard}>
                <div className={styles.returnInfoIcon}>
                  <CreditCard size={24} />
                </div>
                <div className={styles.returnDetail}>
                  <span className={styles.detailLabel}>Trạng thái thanh toán</span>
                  <span className={styles.detailValue}>{getPaymentStatusText(returnDetails.paymentStatus)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className={styles.customerInfoSection}>
            <h2 className={styles.sectionTitle}>Thông tin khách hàng</h2>
            <div className={styles.customerInfo}>
              <div className={styles.customerInfoCard}>
                <div className={styles.customerInfoIcon}>
                  <User size={24} />
                </div>
                <div className={styles.customerDetail}>
                  <span className={styles.detailLabel}>Họ và tên</span>
                  <span className={styles.detailValue}>{returnDetails.fullName}</span>
                </div>
              </div>

              <div className={styles.customerInfoCard}>
                <div className={styles.customerInfoIcon}>
                  <Phone size={24} />
                </div>
                <div className={styles.customerDetail}>
                  <span className={styles.detailLabel}>Số điện thoại</span>
                  <span className={styles.detailValue}>{returnDetails.phone}</span>
                </div>
              </div>

              {returnDetails.notes && (
                <div className={styles.customerInfoCard}>
                  <div className={styles.customerInfoIcon}>
                    <MapPin size={24} />
                  </div>
                  <div className={styles.customerDetail}>
                    <span className={styles.detailLabel}>Ghi chú</span>
                    <span className={styles.detailValue}>{returnDetails.notes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {returnDetails.deliveryMethod === "Online" && (
            <div className={styles.pickupInfoSection}>
              <h2 className={styles.sectionTitle}>Thông tin lấy sách</h2>
              <div className={styles.pickupInfo}>
                {returnDetails.street && (
                  <div className={styles.pickupDetail}>
                    <span className={styles.pickupLabel}>Địa chỉ lấy sách:</span>
                    <span className={styles.pickupValue}>
                      {[returnDetails.street, returnDetails.ward, returnDetails.district, returnDetails.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {returnDetails.receiveDay && (
                  <div className={styles.pickupDetail}>
                    <span className={styles.pickupLabel}>Ngày dự kiến lấy sách:</span>
                    <span className={styles.pickupValue}>{formatDate(returnDetails.receiveDay)}</span>
                  </div>
                )}
                <div className={styles.pickupNote}>
                  <p>
                    Shipper sẽ đến địa chỉ của bạn trong khoảng thời gian từ 8:00 - 18:00 vào ngày dự kiến. Vui lòng
                    chuẩn bị sẵn sách và đảm bảo có người nhận.
                  </p>
                </div>
              </div>
            </div>
          )}

          {returnDetails.deliveryMethod === "Offline" && (
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
              {returnDetails.items?.map((item) => (
                <div key={item.id} className={styles.returnItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.bookName}
                      className={styles.itemThumbnail}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.bookName}</h3>
                    <div className={styles.itemRentDetails}>
                      <span className={styles.itemQuantity}>Số lượng: {item.quantity}</span>
                      <div className={styles.itemDates}>
                        {item.rentalDate && <span>Ngày thuê: {formatDate(item.rentalDate)}</span>}
                        {item.returnDate && <span>Ngày trả: {formatDate(item.returnDate)}</span>}
                      </div>
                    </div>
                    <div className={styles.itemPricing}>
                      <span>Giá thuê: {formatCurrency(item.rentalPrice)}đ</span>
                      <span>Tiền cọc: {formatCurrency(item.depositPrice)}đ</span>
                    </div>
                    <div className={styles.itemStatus}>
                      <span className={`${styles.statusBadge} ${styles[item.status?.toLowerCase()]}`}>
                        {item.status}
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
                <span>Tổng tiền cọc:</span>
                <span>{formatCurrency(totals.totalDeposit)}đ</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tổng tiền thuê:</span>
                <span>-{formatCurrency(totals.totalRental)}đ</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>Tổng tiền hoàn trả:</span>
                <span>{formatCurrency(refundAmount)}đ</span>
              </div>

              <div className={styles.refundInfo}>
                {returnDetails.deliveryMethod === "Offline" ? (
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