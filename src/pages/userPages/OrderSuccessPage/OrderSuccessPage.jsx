import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, ArrowRight, ShoppingBag, Calendar, MapPin, CreditCard, Clock, AlertCircle } from "lucide-react"
import styles from "./OrderSuccessPage.module.css"


const OrderSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, completed, later
  const [isProcessing, setIsProcessing] = useState(false)

  const needsPaymentPage = mockOrderData.paymentMethod === "CARD" || mockOrderData.paymentMethod === "MOMO"

  const getTotalPrice = () => {
    return mockOrderData.items.reduce((total, item) => total + item.rental_price * item.quantity * item.rent_day, 0)
  }

  const getTotalDeposit = () => {
    return mockOrderData.items.reduce((total, item) => total + item.deposit_price * item.quantity, 0)
  }

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

  const handlePayNow = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setPaymentStatus("completed")
      setIsProcessing(false)
    }, 2000)
  }

  const handlePayLater = () => {
    setPaymentStatus("later")
  }

  if (needsPaymentPage && paymentStatus === "pending") {
    return (
      <PaymentPage 
        orderData={mockOrderData}
        isProcessing={isProcessing}
        handlePayNow={handlePayNow}
        handlePayLater={handlePayLater}
        formatDate={formatDate}
        getPaymentMethodText={getPaymentMethodText}
        getTotalPrice={getTotalPrice}
      />
    )
  }

  if (needsPaymentPage && paymentStatus === "later") {
    return (
      <PendingPaymentPage 
        orderData={mockOrderData}
        formatDate={formatDate}
        getDeliveryMethodText={getDeliveryMethodText}
        getPaymentMethodText={getPaymentMethodText}
        getTotalPrice={getTotalPrice}
        getTotalDeposit={getTotalDeposit}
      />
    )
  }

  return (
    <SuccessfulOrderPage 
      orderData={mockOrderData}
      formatDate={formatDate}
      getDeliveryMethodText={getDeliveryMethodText}
      getPaymentMethodText={getPaymentMethodText}
      getTotalPrice={getTotalPrice}
      getTotalDeposit={getTotalDeposit}
      addDays={addDays}
    />
  )
}

export default OrderSuccessPage

// Mock order data
const mockOrderData = {
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
  paymentMethod: "MOMO", // Có thể là "CASH", "CARD", "MOMO"
  rentalPeriod: "14 ngày",
  estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  totalRental: 80000,
  totalDeposit: 320000,
  shippingFee: 30000,
  totalPayment: 110000,
}

// Helper Components
const OrderInfoCard = ({icon : Icon, label, value }) => (
  <div className={styles.orderInfoCard}>
    <div className={styles.orderInfoIcon}>
      <Icon size={24} />
    </div>
    <div className={styles.orderDetail}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  </div>
)

const SummaryRow = ({ label, value }) => (
  <div className={styles.summaryRow}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

const SummaryTotal = ({ label, value }) => (
  <div className={styles.summaryTotal}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

const DepositInfo = ({ amount, note }) => (
  <div className={styles.depositInfo}>
    <div className={styles.depositHeader}>
      <span>Tiền đặt cọc:</span>
      <span>{amount}</span>
    </div>
    <p className={styles.depositNote}>{note}</p>
  </div>
)

// Functional Components
const OrderInfoSection = ({ orderId, orderDate, deliveryMethod, paymentMethod, formatDate, getDeliveryMethodText, getPaymentMethodText }) => (
  <div className={styles.orderInfoSection}>
    <h2 className={styles.sectionTitle}>Thông tin đơn hàng</h2>
    <div className={styles.orderInfo}>
      <OrderInfoCard 
        icon={ShoppingBag} 
        label="Mã đơn hàng" 
        value={`#${orderId}`} 
      />
      <OrderInfoCard 
        icon={Calendar} 
        label="Ngày đặt hàng" 
        value={formatDate(orderDate)} 
      />
      <OrderInfoCard 
        icon={MapPin} 
        label="Phương thức nhận hàng" 
        value={getDeliveryMethodText(deliveryMethod)} 
      />
      <OrderInfoCard 
        icon={CreditCard} 
        label="Phương thức thanh toán" 
        value={getPaymentMethodText(paymentMethod)} 
      />
    </div>
  </div>
)

const OrderItemsSection = ({ items, addDays }) => (
  <div className={styles.orderItemsSection}>
    <h2 className={styles.sectionTitle}>Sách đã thuê</h2>
    <div className={styles.orderItems}>
      {items.map((item) => (
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
)

const PaymentSummary = ({ totalPrice, shippingFee, totalDeposit }) => (
  <div className={styles.paymentSummary}>
    <h2 className={styles.sectionTitle}>Tóm tắt thanh toán</h2>
    <div className={styles.summaryContent}>
      <SummaryRow 
        label="Tổng tiền thuê:" 
        value={`${totalPrice.toLocaleString("vi-VN")}đ`} 
      />

      {shippingFee > 0 && (
        <SummaryRow 
          label="Phí vận chuyển:" 
          value={`${shippingFee.toLocaleString("vi-VN")}đ`} 
        />
      )}

      <SummaryTotal 
        label="Tổng thanh toán:" 
        value={`${(totalPrice + shippingFee).toLocaleString("vi-VN")}đ`} 
      />

      <DepositInfo 
        amount={`${totalDeposit.toLocaleString("vi-VN")}đ`} 
        note="Tiền đặt cọc sẽ được hoàn trả khi bạn trả sách đúng hạn và sách không bị hư hỏng" 
      />
    </div>
  </div>
)

const DeliveryInfoSection = ({ address, estimatedDeliveryDate, formatDate }) => (
  <div className={styles.deliveryInfoSection}>
    <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
    <div className={styles.deliveryInfo}>
      <div className={styles.deliveryDetail}>
        <span className={styles.deliveryLabel}>Địa chỉ giao hàng:</span>
        <span className={styles.deliveryValue}>{address}</span>
      </div>
      <div className={styles.deliveryDetail}>
        <span className={styles.deliveryLabel}>Ngày dự kiến giao hàng:</span>
        <span className={styles.deliveryValue}>{formatDate(estimatedDeliveryDate)}</span>
      </div>
    </div>
  </div>
)

const ActionButtons = () => (
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
)

const BankInfoSection = ({ orderId }) => (
  <div className={styles.bankInfoSection}>
    <h2 className={styles.sectionTitle}>Thông tin chuyển khoản</h2>
    <div className={styles.bankInfo}>
      <div className={styles.bankDetail}>
        <span className={styles.bankLabel}>Ngân hàng:</span>
        <span className={styles.bankValue}>Vietcombank</span>
      </div>
      <div className={styles.bankDetail}>
        <span className={styles.bankLabel}>Số tài khoản:</span>
        <span className={styles.bankValue}>1234567890</span>
      </div>
      <div className={styles.bankDetail}>
        <span className={styles.bankLabel}>Chủ tài khoản:</span>
        <span className={styles.bankValue}>CÔNG TY TNHH BOOK RENTAL</span>
      </div>
      <div className={styles.bankDetail}>
        <span className={styles.bankLabel}>Nội dung chuyển khoản:</span>
        <span className={styles.bankValue}>#{orderId}</span>
      </div>
      <p className={styles.bankInfoNote}>Vui lòng chuyển khoản trong vòng 24 giờ để đơn hàng được xử lý.</p>
    </div>
  </div>
)

const MomoPaymentSection = ({ totalPrice, shippingFee }) => (
  <div className={styles.momoPaymentSection}>
    <h2 className={styles.sectionTitle}>Thanh toán qua MoMo</h2>
    <div className={styles.momoInfo}>
      <div className={styles.qrCodeContainer}>
        <div className={styles.qrCodePlaceholder}>
          <p>Mã QR MoMo</p>
        </div>
      </div>
      <div className={styles.momoInstructions}>
        <h3>Hướng dẫn thanh toán</h3>
        <ol>
          <li>Mở ứng dụng MoMo trên điện thoại của bạn</li>
          <li>Chọn "Quét mã QR" và quét mã bên cạnh</li>
          <li>
            Xác nhận thanh toán số tiền{" "}
            {(totalPrice + shippingFee).toLocaleString("vi-VN")}đ
          </li>
          <li>Hoàn tất thanh toán trên ứng dụng MoMo</li>
        </ol>
      </div>
    </div>
  </div>
)

const OrderSummarySection = ({ orderId, orderDate, paymentMethod, totalPrice, shippingFee, formatDate, getPaymentMethodText }) => (
  <div className={styles.orderSummarySection}>
    <h2 className={styles.sectionTitle}>Thông tin đơn hàng</h2>
    <div className={styles.orderSummaryContent}>
      <div className={styles.orderSummaryDetail}>
        <span className={styles.summaryLabel}>Mã đơn hàng:</span>
        <span className={styles.summaryValue}>#{orderId}</span>
      </div>
      <div className={styles.orderSummaryDetail}>
        <span className={styles.summaryLabel}>Ngày đặt hàng:</span>
        <span className={styles.summaryValue}>{formatDate(orderDate)}</span>
      </div>
      <div className={styles.orderSummaryDetail}>
        <span className={styles.summaryLabel}>Phương thức thanh toán:</span>
        <span className={styles.summaryValue}>{getPaymentMethodText(paymentMethod)}</span>
      </div>
      <div className={styles.orderSummaryDetail}>
        <span className={styles.summaryLabel}>Tổng thanh toán:</span>
        <span className={styles.summaryValueHighlight}>
          {(totalPrice + shippingFee).toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  </div>
)

// Page Components
const SuccessfulOrderPage = ({ orderData, formatDate, getDeliveryMethodText, getPaymentMethodText, getTotalPrice, getTotalDeposit, addDays }) => (
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

        <OrderInfoSection 
          orderId={orderData.orderId}
          orderDate={orderData.orderDate}
          deliveryMethod={orderData.deliveryMethod}
          paymentMethod={orderData.paymentMethod}
          formatDate={formatDate}
          getDeliveryMethodText={getDeliveryMethodText}
          getPaymentMethodText={getPaymentMethodText}
        />

        <OrderItemsSection 
          items={orderData.items} 
          addDays={addDays} 
        />

        <PaymentSummary 
          totalPrice={getTotalPrice()}
          shippingFee={orderData.shippingFee}
          totalDeposit={getTotalDeposit()}
        />

        <DeliveryInfoSection 
          address={orderData.address}
          estimatedDeliveryDate={orderData.estimatedDeliveryDate}
          formatDate={formatDate}
        />

        <ActionButtons />
      </div>
    </div>
  </div>
)

const PaymentPage = ({ 
  orderData, 
  isProcessing, 
  handlePayNow, 
  handlePayLater, 
  formatDate, 
  getPaymentMethodText, 
  getTotalPrice 
}) => (
  <div className={styles.successPage}>
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.paymentPageHeader}>
          <div className={styles.paymentIcon}>
            {orderData.paymentMethod === "MOMO" ? (
              <CreditCard size={48} color="#a839b2" />
            ) : (
              <CreditCard size={48} color="#3b82f6" />
            )}
          </div>
          <h1 className={styles.paymentTitle}>Hoàn tất thanh toán</h1>
          <p className={styles.paymentMessage}>
            Đơn hàng của bạn đã được tạo thành công. Vui lòng hoàn tất thanh toán để tiếp tục.
          </p>
        </div>

        <OrderSummarySection 
          orderId={orderData.orderId}
          orderDate={orderData.orderDate}
          paymentMethod={orderData.paymentMethod}
          totalPrice={getTotalPrice()}
          shippingFee={orderData.shippingFee}
          formatDate={formatDate}
          getPaymentMethodText={getPaymentMethodText}
        />

        {orderData.paymentMethod === "CARD" && (
          <BankInfoSection orderId={orderData.orderId} />
        )}

        {orderData.paymentMethod === "MOMO" && (
          <MomoPaymentSection 
            totalPrice={getTotalPrice()} 
            shippingFee={orderData.shippingFee} 
          />
        )}

        <div className={styles.paymentActions}>
          <button
            className={`${styles.payNowButton} ${isProcessing ? styles.processing : ""}`}
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Đã thanh toán xong"}
          </button>
          <button className={styles.payLaterButton} onClick={handlePayLater} disabled={isProcessing}>
            Thanh toán sau
          </button>
        </div>

        <div className={styles.paymentNote}>
          <AlertCircle size={16} />
          <p>
            Nếu bạn chọn "Thanh toán sau", đơn hàng của bạn sẽ được đặt vào trạng thái chờ thanh toán và sẽ được xử
            lý sau khi bạn hoàn tất thanh toán.
          </p>
        </div>
      </div>
    </div>
  </div>
)

const PendingPaymentPage = ({ 
  orderData, 
  formatDate, 
  getDeliveryMethodText, 
  getPaymentMethodText, 
  getTotalPrice, 
  getTotalDeposit 
}) => (
  <div className={styles.successPage}>
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.pendingHeader}>
          <div className={styles.pendingIcon}>
            <Clock size={64} />
          </div>
          <h1 className={styles.pendingTitle}>Đơn hàng đang chờ thanh toán</h1>
          <p className={styles.pendingMessage}>
            Đơn hàng của bạn đã được tạo thành công và đang chờ thanh toán. Vui lòng hoàn tất thanh toán trong vòng
            24 giờ để đơn hàng được xử lý.
          </p>
        </div>

        <OrderInfoSection 
          orderId={orderData.orderId}
          orderDate={orderData.orderDate}
          deliveryMethod={orderData.deliveryMethod}
          paymentMethod={orderData.paymentMethod}
          formatDate={formatDate}
          getDeliveryMethodText={getDeliveryMethodText}
          getPaymentMethodText={getPaymentMethodText}
        />

        <PaymentSummary 
          totalPrice={getTotalPrice()}
          shippingFee={orderData.shippingFee}
          totalDeposit={getTotalDeposit()}
        />

        {orderData.paymentMethod === "CARD" && (
          <BankInfoSection orderId={orderData.orderId} />
        )}

        <ActionButtons />
      </div>
    </div>
  </div>
)
