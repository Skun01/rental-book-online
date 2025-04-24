"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../../contexts/CartContext"
import { useToast } from "../../../contexts/ToastContext"
import styles from "./CheckoutPage.module.css"
import { useAuth } from "../../../contexts/AuthContext"

const CheckoutPage = () => {
  // Sửa lỗi "Cannot read properties of undefined (reading 'deposit_price')"
  // Thay đổi cách truy cập dữ liệu giỏ hàng

  // Thay thế dòng này:
  // const { cart, totalItems, calculateTotal, clearCart } = useCart()

  // Bằng dòng này:
  const { cartItems, getTotalPrice, getTotalDeposit, getCartItemCount, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
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
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  // Thay thế depositTotal và rentalFeeTotal
  // Thay thế dòng này:
  // const depositTotal = calculateTotal("deposit")
  // const rentalFeeTotal = calculateTotal("rental")

  // Bằng dòng này:
  const depositTotal = getTotalDeposit()
  const rentalFeeTotal = getTotalPrice()

  // Thay thế totalItems bằng getCartItemCount()
  useEffect(() => {
    // Chỉ redirect khi component mount lần đầu và giỏ hàng trống
    const redirectIfEmpty = () => {
      if (getCartItemCount() === 0) {
        navigate("/cart")
      }
    }
    redirectIfEmpty()
  }, []) // Chỉ chạy một lần khi component mount

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // TODO: Replace with actual API call
        const mockAddresses = [
          {
            id: 1,
            address: "123 Đường ABC",
            city: "Hồ Chí Minh",
            district: "Quận 1",
            is_default: true
          },
          {
            id: 2,
            address: "456 Đường XYZ",
            city: "Hồ Chí Minh",
            district: "Quận 3",
            is_default: false
          }
        ]
        setAddresses(mockAddresses)
        const defaultAddress = mockAddresses.find(addr => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
          setFormData(prev => ({
            ...prev,
            address: defaultAddress.address,
            city: defaultAddress.city,
            district: defaultAddress.district
          }))
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
        showToast("Không thể tải địa chỉ đã lưu", "error")
      }
    }

    if (currentUser) {
      fetchAddresses()
    }
  }, [currentUser, showToast])

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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Bạn phải đồng ý với các điều khoản và điều kiện"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Chuyển đổi giá trị payment_method để phù hợp với ENUM trong database
        let dbPaymentMethod = "CASH"
        if (formData.paymentMethod === "e-wallet") {
          dbPaymentMethod = "MOMO"
        } else if (formData.paymentMethod === "bank-transfer") {
          dbPaymentMethod = "CARD"
        }

        const orderDetails = {
          orderId: "ORD-" + Math.floor(Math.random() * 10000),
          orderDate: new Date().toISOString(),
          items: cartItems,
          deliveryMethod: formData.deliveryMethod,
          pickupLocation: formData.deliveryMethod === "library-pickup" ? formData.pickupLocation : "",
          address:
            formData.deliveryMethod === "home-delivery"
              ? `${formData.address}, ${formData.district}, ${formData.city}`
              : "",
          paymentMethod: dbPaymentMethod,
          rentalPeriod: "14 ngày",
          estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          totalRental: rentalFeeTotal,
          totalDeposit: depositTotal,
          shippingFee: formData.deliveryMethod === "home-delivery" ? 30000 : 0,
          totalPayment: rentalFeeTotal + (formData.deliveryMethod === "home-delivery" ? 30000 : 0),
        }

        // Đầu tiên, chuyển hướng đến trang success
        navigate("/orders/success", {
          state: orderDetails,
          replace: true,
        })

        // Sau đó mới clear cart và hiển thị toast
        clearCart()
        showToast({
          type: "success",
          message: "Đặt hàng thành công!",
        })
      } catch (error) {
        console.error("Lỗi khi xử lý đơn hàng:", error)
        setErrors({ submit: "Có lỗi khi xử lý đơn hàng. Vui lòng thử lại." })
        showToast({
          type: "error",
          message: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleAddressSelect = (addressId) => {
    if (addressId === "new") {
      setSelectedAddressId(null)
      setShowNewAddressForm(true)
      setFormData(prev => ({
        ...prev,
        address: "",
        city: "",
        district: ""
      }))
    } else {
      const selectedAddress = addresses.find(addr => addr.id === addressId)
      if (selectedAddress) {
        setSelectedAddressId(addressId)
        setShowNewAddressForm(false)
        setFormData(prev => ({
          ...prev,
          address: selectedAddress.address,
          city: selectedAddress.city,
          district: selectedAddress.district
        }))
      }
    }
  }

  if (getCartItemCount() === 0) {
    return <div className="loading">Đang chuyển hướng đến giỏ hàng...</div>
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Thanh Toán</h1>

        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutFormContainer}>
            <form onSubmit={handleSubmit} className={styles.checkoutForm}>

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
                      <span className={styles.optionTitle}>Nhận tại Thư viện</span>
                      <span className={styles.optionDescription}>
                        Nhận sách tại một trong những địa điểm thư viện của chúng tôi
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
                      <option value="main-library">Thư viện chính</option>
                      <option value="branch-library">Thư viện chi nhánh</option>
                      <option value="campus-library">Thư viện trường học</option>
                    </select>
                  </div>
                )}

                {formData.deliveryMethod === "home-delivery" && (
                  <div className={styles.deliverySection}>
                    <h3>Thông tin giao hàng</h3>
                    {currentUser && addresses.length > 0 && (
                      <div className={styles.savedAddresses}>
                        <h4>Địa chỉ đã lưu</h4>
                        <div className={styles.addressList}>
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className={`${styles.addressCard} ${
                                selectedAddressId === addr.id ? styles.selected : ""
                              }`}
                              onClick={() => handleAddressSelect(addr.id)}
                            >
                              <div className={styles.addressInfo}>
                                <p>{addr.address}</p>
                                <p>{addr.district}, {addr.city}</p>
                                {addr.is_default && <span className={styles.defaultBadge}>Mặc định</span>}
                              </div>
                            </div>
                          ))}
                          <div
                            className={`${styles.addressCard} ${styles.newAddress} ${
                              showNewAddressForm ? styles.selected : ""
                            }`}
                            onClick={() => handleAddressSelect("new")}
                          >
                            <div className={styles.addressInfo}>
                              <p>+ Thêm địa chỉ mới</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(!currentUser || showNewAddressForm) && (
                      <div className={styles.addressForm}>
                        {currentUser && <h4>Địa chỉ mới</h4>}
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
                      id="bank-transfer"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === "bank-transfer"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="bank-transfer">
                      <span className={styles.optionTitle}>Chuyển khoản ngân hàng</span>
                      <span className={styles.optionDescription}>Thanh toán qua chuyển khoản ngân hàng</span>
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

                {formData.paymentMethod === "bank-transfer" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="accountNumber">Số tài khoản</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={errors.accountNumber ? styles.error : ""}
                    />
                    {errors.accountNumber && <span className={styles.errorMessage}>{errors.accountNumber}</span>}
                  </div>
                )}
              </div>

              <div className={styles.formSection}>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={errors.agreeToTerms ? styles.error : ""}
                  />
                  <label htmlFor="agreeToTerms">
                    Tôi đồng ý với{" "}
                    <a href="#" className={styles.termsLink}>
                      Điều khoản và Điều kiện
                    </a>{" "}
                    và{" "}
                    <a href="#" className={styles.termsLink}>
                      Chính sách cho thuê
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && <span className={styles.errorMessage}>{errors.agreeToTerms}</span>}
              </div>

              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

              <button type="submit" className={styles.checkoutButton} disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất thuê"}
              </button>
            </form>
          </div>

          <div className={styles.orderSummaryContainer}>
            <div className={styles.orderSummary}>
              <h2>Tóm tắt đơn hàng</h2>

              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
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
                      <p className={styles.itemAuthor}>
                        {item.author ||
                          (item.authors && item.authors.length > 0
                            ? item.authors.map((author) => author.name).join(", ")
                            : "Tác giả không xác định")}
                      </p>
                      <div className={styles.itemPrice}>
                        <span>₫{(item.rental_price * item.quantity).toLocaleString()}</span>
                        <span className={styles.depositAmount}> (Đặt cọc: ₫{item.deposit_price.toLocaleString()})</span>
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
                  <span>₫{depositTotal.toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng phí thuê:</span>
                  <span>₫{rentalFeeTotal.toLocaleString()}</span>
                </div>
                {formData.deliveryMethod === "home-delivery" && (
                  <div className={styles.summaryRow}>
                    <span>Phí vận chuyển:</span>
                    <span>₫30,000</span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span>Tổng thanh toán:</span>
                  <span>
                    ₫{(rentalFeeTotal + (formData.deliveryMethod === "home-delivery" ? 30000 : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.rentalNote}>
                <p>
                  <strong>Lưu ý:</strong> Số tiền cọc sẽ được hoàn lại khi bạn trả sách trong tình trạng tốt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
