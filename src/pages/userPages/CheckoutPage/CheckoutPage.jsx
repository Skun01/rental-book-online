"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./CheckoutPage.module.css"

// Mock data for cart items
const mockCartItems = [
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
]

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryMethod: "library-pickup",
    pickupLocation: "main-library",
    address: "",
    city: "",
    district: "",
    paymentMethod: "e-wallet",
    accountNumber: "",
  })
  const [errors, setErrors] = useState({})
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  // tong tien coc va tien dat sach
  const getTotalPrice = () => {
    return mockCartItems.reduce((total, item) => total + item.rental_price * item.quantity * item.rent_day, 0)
  }

  const getTotalDeposit = () => {
    return mockCartItems.reduce((total, item) => total + item.deposit_price * item.quantity, 0)
  }


  const getCartItemCount = () => {
    return mockCartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const addDays = (days) => {
    const today = new Date()
    today.setDate(today.getDate() + days)
    return today.toLocaleDateString("vi-VN")
  }

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Mock addresses data
        const mockAddresses = [
          {
            id: 1,
            address: "Số nhà 25/156 đường phú minh, Văn trì, Minh khai",
            city: "Hà Nội",
            district: "Bắc từ liêm",
            is_default: true,
          },
          {
            id: 1,
            address: "Xóm Rú Đất, Xã Long Thành",
            city: "Hà Nội",
            district: "Yên Thành",
            is_default: false,
          },
        ]
        setAddresses(mockAddresses)
        const defaultAddress = mockAddresses.find((addr) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
          setFormData((prev) => ({
            ...prev,
            address: defaultAddress.address,
            city: defaultAddress.city,
            district: defaultAddress.district,
          }))
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
      }
    }

    fetchAddresses()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc"
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (formData.deliveryMethod === "home-delivery") {
      if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc"
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc"
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc"
    }

    if (formData.paymentMethod === "bank-transfer" && !formData.accountNumber.trim()) {
      newErrors.accountNumber = "Số tài khoản là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // xu ly hoan tat cho thue
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        navigate("/checkout/success")
      } catch (error) {
        console.error("Lỗi khi xử lý đơn hàng:", error)
        setErrors({ submit: "Có lỗi khi xử lý đơn hàng. Vui lòng thử lại." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleAddressSelect = (addressId) => {
    if (addressId === "new") {
      setSelectedAddressId(null)
      setShowNewAddressForm(true)
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        district: "",
      }))
    } else {
      const selectedAddress = addresses.find((addr) => addr.id === addressId)
      if (selectedAddress) {
        setSelectedAddressId(addressId)
        setShowNewAddressForm(false)
        setFormData((prev) => ({
          ...prev,
          address: selectedAddress.address,
          city: selectedAddress.city,
          district: selectedAddress.district,
        }))
      }
    }
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Thanh Toán</h1>

        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutFormContainer}>
            <CheckoutForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              showNewAddressForm={showNewAddressForm}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleAddressSelect={handleAddressSelect}
            />
          </div>

          <div className={styles.orderSummaryContainer}>
            <OrderSummary
              cartItems={mockCartItems}
              getTotalPrice={getTotalPrice}
              getTotalDeposit={getTotalDeposit}
              getCartItemCount={getCartItemCount}
              deliveryMethod={formData.deliveryMethod}
              addDays={addDays}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Thanh Toán
const CheckoutForm = ({
  formData,
  errors,
  isSubmitting,
  addresses,
  selectedAddressId,
  showNewAddressForm,
  handleInputChange,
  handleSubmit,
  handleAddressSelect,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <PersonalInfoSection formData={formData} errors={errors} handleInputChange={handleInputChange} />

      <DeliveryMethodSection
        formData={formData}
        errors={errors}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        showNewAddressForm={showNewAddressForm}
        handleInputChange={handleInputChange}
        handleAddressSelect={handleAddressSelect}
      />

      <PaymentMethodSection formData={formData} errors={errors} handleInputChange={handleInputChange} />

      {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

      <button type="submit" className={styles.checkoutButton} disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : "Hoàn tất thuê"}
      </button>
    </form>
  )
}

// Thông Tin Cá Nhân
const PersonalInfoSection = ({ formData, errors, handleInputChange }) => {
  return (
    <div className={styles.formSection}>
      <h2>Thông Tin Cá Nhân</h2>
      <div className={styles.formGroup}>
        <label htmlFor="fullName">Họ và Tên</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={errors.fullName ? styles.error : ""}
        />
        {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? styles.error : ""}
        />
        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Số Điện Thoại</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={errors.phone ? styles.error : ""}
        />
        {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
      </div>
    </div>
  )
}

// Phương Thức Nhận Hàng
const DeliveryMethodSection = ({
  formData,
  errors,
  addresses,
  selectedAddressId,
  showNewAddressForm,
  handleInputChange,
  handleAddressSelect,
}) => {
  return (
    <div className={styles.formSection}>
      <h2>Phương Thức Nhận Hàng</h2>
      <div className={styles.deliveryOptions}>
        <div className={styles.deliveryOption}>
          <input
            type="radio"
            id="library-pickup"
            name="deliveryMethod"
            value="library-pickup"
            checked={formData.deliveryMethod === "library-pickup"}
            onChange={handleInputChange}
          />
          <label htmlFor="library-pickup">
            <span className={styles.optionTitle}>Nhận tại tại thư viện sách</span>
            <span className={styles.optionDescription}>
              Nhận sách tại một trong những địa điểm thư viện
            </span>
          </label>
        </div>

        <div className={styles.deliveryOption}>
          <input
            type="radio"
            id="home-delivery"
            name="deliveryMethod"
            value="home-delivery"
            checked={formData.deliveryMethod === "home-delivery"}
            onChange={handleInputChange}
          />
          <label htmlFor="home-delivery">
            <span className={styles.optionTitle}>Giao hàng tận nơi</span>
            <span className={styles.optionDescription}>Nhận sách ngay tại nhà của bạn</span>
          </label>
        </div>
      </div>

      {formData.deliveryMethod === "library-pickup" && (
        <div className={styles.formGroup}>
          <label htmlFor="pickupLocation">Địa điểm nhận sách</label>
          <select
            id="pickupLocation"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
          >
            <option value="main-library">Thư viện tòa A11 cơ sở 1 Đại Học Công Nghiệp Hà nội, Minh Khai, Bắc Từ Liêm Hà Nội</option>
            <option value="branch-library">Thư viện tòa C3 cơ sở 3 Đại Học Công Nghiệp Hà nội, Phủ lý, Hà Nam</option>
          </select>
        </div>
      )}

      {formData.deliveryMethod === "home-delivery" && (
        <div className={styles.deliverySection}>
          <h3>Thông tin giao hàng</h3>
          {addresses.length > 0 && (
            <div className={styles.savedAddresses}>
              <h4>Địa chỉ đã lưu</h4>
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ""}`}
                    onClick={() => handleAddressSelect(addr.id)}
                  >
                    <div className={styles.addressInfo}>
                      <p>{addr.address}</p>
                      <p>
                        {addr.district}, {addr.city}
                      </p>
                      {addr.is_default && <span className={styles.defaultBadge}>Mặc định</span>}
                    </div>
                  </div>
                ))}
                <div
                  className={`${styles.addressCard} ${styles.newAddress} ${showNewAddressForm ? styles.selected : ""}`}
                  onClick={() => handleAddressSelect("new")}
                >
                  <div className={styles.addressInfo}>
                    <p>+ Thêm địa chỉ mới</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showNewAddressForm && (
            <div className={styles.addressForm}>
              <h4>Địa chỉ mới</h4>
              <div className={styles.formGroup}>
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? styles.error : ""}
                />
                {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">Thành phố</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? styles.error : ""}
                  />
                  {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="district">Quận/Huyện</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={errors.district ? styles.error : ""}
                  />
                  {errors.district && <span className={styles.errorMessage}>{errors.district}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Phương Thức Thanh Toán
const PaymentMethodSection = ({ formData,  handleInputChange }) => {
  return (
    <div className={styles.formSection}>
      <h2>Phương Thức Thanh Toán</h2>
      <div className={styles.paymentOptions}>
        <div className={styles.paymentOption}>
          <input
            type="radio"
            id="e-wallet"
            name="paymentMethod"
            value="e-wallet"
            checked={formData.paymentMethod === "e-wallet"}
            onChange={handleInputChange}
          />
          <label htmlFor="e-wallet">
            <span className={styles.optionTitle}>Ví điện tử</span>
            <span className={styles.optionDescription}>Thanh toán bằng MoMo, ZaloPay, v.v.</span>
          </label>
        </div>
        <div className={styles.paymentOption}>
          <input
            type="radio"
            id="cash"
            name="paymentMethod"
            value="cash"
            checked={formData.paymentMethod === "cash"}
            onChange={handleInputChange}
          />
          <label htmlFor="cash">
            <span className={styles.optionTitle}>Thanh toán khi nhận hàng</span>
            <span className={styles.optionDescription}>Thanh toán khi nhận sách</span>
          </label>
        </div>
      </div>
    </div>
  )
}

// Component Tóm Tắt Đơn Hàng
const OrderSummary = ({ cartItems, getTotalPrice, getTotalDeposit, getCartItemCount, deliveryMethod, addDays }) => {
  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <img src={item.cover_image || "/placeholder.svg"} alt={item.title} className={styles.itemThumbnail} />
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
                <span className={styles.depositAmount}> (Đặt cọc: {item.deposit_price.toLocaleString("vi-VN")}đ)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Tổng số lượng:</span>
          <span>{getCartItemCount()}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tổng tiền cọc:</span>
          <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tổng phí thuê:</span>
          <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
        </div>
        {deliveryMethod === "home-delivery" && (
          <div className={styles.summaryRow}>
            <span>Phí vận chuyển:</span>
            <span>30.000đ</span>
          </div>
        )}
        <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
          <span>Tổng thanh toán:</span>
          <span>{(getTotalPrice() + (deliveryMethod === "home-delivery" ? 30000 : 0)).toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <div className={styles.rentalNote}>
        <p>
          <strong>Lưu ý:</strong> Số tiền cọc sẽ được hoàn lại khi bạn trả sách trong tình trạng tốt.
        </p>
      </div>
    </div>
  )
}

export default CheckoutPage
