import { useState, useEffect } from "react"
import { useCart } from "../../../contexts/CartContext"
import styles from "./CheckoutPage.module.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { useToast } from "../../../contexts/ToastContext"
import axios from "axios"

const CheckoutPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    deliveryMethod: "offline", // [offline, online]
    branchId: 1,
    pickupDate: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    notes: "",
    paymentMethod: "EWallet",
    paymentStatus:  "Unpaid", 
    shippingMethod: "Standard",
    accountNumber: "",
    receiveDay: ""
  })
  const [errors, setErrors] = useState({})
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const { getTotalPrice, getTotalDeposit, getCartItemCount, cartItems, 
    restoreCartItems, getPostCartItems, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const OtherSiteData = location.state;
  

  // Tạo lịch chọn 3 ngày liên tục để đến nhận sách khi nhận tại thư viện
  const getAvailablePickupDates = () => {
    const dates = []
    for (let i = 1; i <= 3; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      })
    }
    return dates
  }


  // xử lý lấy ngày nhận dự kiến
  const getExpectedDate = () => {
    if (formData.deliveryMethod === "library-pickup") {
      if (formData.pickupDate) {
        const date = new Date(formData.pickupDate)
        return `${date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}`
      }
      return "Chưa chọn thời gian"
    } else {
      const days = formData.shippingMethod === "Express" ? 1 : 3
      const date = new Date()
      date.setDate(date.getDate() + days)
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  // get user address
  useEffect(() => {
    try {
      const bearer = localStorage.getItem("token")
      async function getUserAddress() {
        await axios
          .get(`http://localhost:8080/api/v1/address/user/${currentUser.id}?page=0&size=10`, {
            headers: {
              Authorization: `${bearer}`,
            },
          })
          .then((response) => {
            setAddresses(response.data.data.content)
            const defaultAddress = response.data.data.content.find((addr) => addr.is_default)
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id)
              setFormData((prev) => ({
                ...prev,
                address: defaultAddress.address,
                city: defaultAddress.city,
                district: defaultAddress.district,
                ward: defaultAddress.ward,
                street: defaultAddress.street,
              }))
            }
          })
      }
      getUserAddress()
    } catch (error) {
      console.error("Error fetching addresses:", error)
    }
  }, [currentUser.id])

  // get all data input from form
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

  // validate form before sending
  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc"

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (formData.deliveryMethod === "Offline") {
      if (!formData.pickupDate) newErrors.pickupDate = "Vui lòng chọn ngày nhận sách"
    }

    if (formData.deliveryMethod === "Online") {
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc"
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc"
      if (!formData.ward.trim()) newErrors.ward = "Phường/Xã là bắt buộc"
      if (!formData.street.trim()) newErrors.street = "Đường/Phố là bắt buộc"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //get all data necessary to send to backend
  const getCheckoutData = () => {
    const shippingFee = formData.deliveryMethod === "Online" ? (formData.shippingMethod === "Express" ? 10000 : 0) : 0
    const basicData = {
      userId: currentUser.id,
      fullName: formData.fullName,
      phone: formData.phone,
      notes: formData.notes,
      totalPrice: getTotalPrice() + shippingFee,
      depositPrice: getTotalDeposit(),
      paymentStatus: "Unpaid",
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      items: getPostCartItems(),
    }
    if(formData.deliveryMethod === "Offline"){
      return {...basicData, 
        branchId: +formData.branchId,
        receiveDay:  new Date(formData.pickupDate).toISOString()
      }
    }else{
      return {...basicData,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        street: formData.street,
        shippingMethod: formData.shippingMethod,
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        const checkoutData = getCheckoutData()
        console.log("checkout data:", checkoutData)
        const bearer = localStorage.getItem("token")
        const response = await axios.post("http://localhost:8080/api/v1/order/rental", checkoutData, {
          headers: {
            Authorization: `${bearer}`
          },
        })
        console.log("Checkout response:", response.data)
        if(!OtherSiteData){
          clearCart()
        }else{
          restoreCartItems()
        }
        navigate(`/checkout/${response.data.data.id}/success`)
      } catch (error) {
        console.error("Lỗi khi đặt đơn hàng:", error)
        showToast({ type: "error", message: "Có lỗi khi xử lý đơn hàng" })
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
        ward: "",
        street: "",
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
          ward: selectedAddress.ward,
          street: selectedAddress.street,
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
            <form onSubmit={handleSubmit} className={styles.checkoutForm}>
              {/* checkout information */}
              <div className={styles.formSection}>
                <h2>Thông Tin Cá Nhân</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Họ và Tên</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} 
                    onChange={handleInputChange} className={errors.fullName ? styles.error : ""}/>
                  {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} 
                    onChange={handleInputChange} className={errors.phone ? styles.error : ""}/>
                  {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>
              </div>

              {/* delivery option */}
              <div className={styles.formSection}>
                <h2>Phương Thức Nhận Sách</h2>
                <div className={styles.deliveryOptions}>
                  <div className={styles.deliveryOption}>
                    <input type="radio" id="library-pickup" name="deliveryMethod" value="Offline" 
                      checked={formData.deliveryMethod === "Offline"} onChange={handleInputChange} />
                    <label htmlFor="library-pickup">
                      <span className={styles.optionTitle}>Nhận tại thư viện sách</span>
                      <span className={styles.optionDescription}>Nhận sách tại một trong những địa điểm thư viện</span>
                    </label>
                  </div>

                  <div className={styles.deliveryOption}>
                    <input
                      type="radio" id="home-delivery" name="deliveryMethod" value="Online" 
                      checked={formData.deliveryMethod === "Online"} onChange={handleInputChange}/>
                    <label htmlFor="home-delivery">
                      <span className={styles.optionTitle}>Giao sách tận nơi</span>
                      <span className={styles.optionDescription}>Nhận sách ngay tại nhà của bạn</span>
                    </label>
                  </div>
                </div>
                
                {/* xu ly chon ngay den nhan sach khi chon den thu vien */}
                {formData.deliveryMethod === "Offline" && (
                  <div className={styles.deliverySection}>
                    <div className={styles.formGroup}>

                      {/* get tensha of toshokan */}
                      <label htmlFor="branchId">Địa điểm nhận sách</label>
                      <select id="branchId" name="branchId" value={formData.branchId} 
                        onChange={handleInputChange}>
                        <option value= {1}>
                          Thư viện tòa A11 cơ sở 1 Đại Học Công Nghiệp Hà nội, Minh Khai, Bắc Từ Liêm Hà Nội
                        </option>
                        <option value={2}>
                          Thư viện tòa C3 cơ sở 3 Đại Học Công Nghiệp Hà nội, Phủ lý, Hà Nam
                        </option>
                      </select>
                    </div>

                    <h3>Thời gian hẹn nhận sách</h3>
                    <p className={styles.pickupNote}>Vui lòng chọn thời gian trong vòng 3 ngày kể từ hôm nay. Nếu bạn không đến nhận sách sau ngày bạn chọn, đơn hàng sẽ bị hủy</p>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="pickupDate">Ngày nhận</label>
                        <select id="pickupDate" name="pickupDate" value={formData.pickupDate} 
                          onChange={handleInputChange} className={errors.pickupDate ? styles.error : ""}>
                          <option value="">Chọn ngày</option>
                          {getAvailablePickupDates().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                        {errors.pickupDate && <span className={styles.errorMessage}>{errors.pickupDate}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* giao hang */}
                {formData.deliveryMethod === "Online" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="shippingMethod">Phương thức vận chuyển</label>
                    <select id="shippingMethod" name="shippingMethod" value={formData.shippingMethod} 
                      onChange={handleInputChange}>
                      <option value="Standard">Tiêu chuẩn (3 ngày)</option>
                      <option value="Express">Nhanh (1 ngày)</option>
                    </select>
                  </div>
                )}

                {/* giao sach tan noi chon dia chi */}
                {formData.deliveryMethod === "Online" && (
                  <div className={styles.deliverySection}>
                    <h3>Thông tin giao hàng</h3>
                    {addresses.length > 0 && (
                      <div className={styles.savedAddresses}>
                        <h4>Địa chỉ đã lưu</h4>
                        <div className={styles.addressList}>
                          {addresses.map((addr) => (
                            <div key={addr.id}
                              className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ""}`}
                              onClick={() => handleAddressSelect(addr.id)}>
                              <div className={styles.addressInfo}>
                                <p>{addr.address}</p>
                                <p>
                                  {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                                </p>
                                {addr.isDefault === "true" && <span className={styles.defaultBadge}>Mặc định</span>}
                              </div>
                            </div>
                          ))}
                          <div className={`${styles.addressCard} ${styles.newAddress} ${showNewAddressForm ? styles.selected : ""}`}
                            onClick={() => handleAddressSelect("new")}>
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
                          <label htmlFor="address">Địa chỉ chi tiết</label>
                          <input type="text" id="address" name="address" value={formData.address} 
                            onChange={handleInputChange} className={errors.address ? styles.error : ""} 
                              placeholder="Số nhà, tên đường..."/>
                          {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="city">Thành phố</label>
                            <input type="text" id="city" name="city" value={formData.city} 
                              onChange={handleInputChange} className={errors.city ? styles.error : ""}
                            />
                            {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                          </div>

                          <div className={styles.formGroup}>
                            <label htmlFor="district">Quận/Huyện</label>
                            <input type="text" id="district" name="district" value={formData.district} 
                              onChange={handleInputChange} className={errors.district ? styles.error : ""} 
                            />
                            {errors.district && <span className={styles.errorMessage}>{errors.district}</span>}
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="ward">Phường/Xã</label>
                            <input type="text" id="ward" name="ward" value={formData.ward} 
                              onChange={handleInputChange} className={errors.ward ? styles.error : ""}
                            />
                            {errors.ward && <span className={styles.errorMessage}>{errors.ward}</span>}
                          </div>

                          <div className={styles.formGroup}>
                            <label htmlFor="street">Đường/Phố</label>
                            <input type="text" id="street" name="street" value={formData.street} 
                              onChange={handleInputChange} className={errors.street ? styles.error : ""}
                            />
                            {errors.street && <span className={styles.errorMessage}>{errors.street}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              <div className={styles.formSection}>
                <h2>Ghi chú</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</label>
                  <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} 
                    rows={3} placeholder="Thêm ghi chú cho đơn hàng..." className={styles.orderNote}
                  />
                </div>
              </div>

              {/* payment */}
              <div className={styles.formSection}>
                <h2>Phương Thức Thanh Toán</h2>
                <div className={styles.paymentOptions}>
                  <div className={styles.paymentOption}>
                    <input type="radio" id="e-wallet" name="paymentMethod" value="EWallet" 
                      checked={formData.paymentMethod === "EWallet"} onChange={handleInputChange}
                    />
                    <label htmlFor="e-wallet">
                      <span className={styles.optionTitle}>Ví điện tử</span>
                      <span className={styles.optionDescription}>Thanh toán bằng MoMo, ZaloPay, v.v.</span>
                    </label>
                  </div>
                  <div className={styles.paymentOption}>
                    <input type="radio" id="cash" name="paymentMethod" value="Cash" 
                      checked={formData.paymentMethod === "Cash"} onChange={handleInputChange}
                    />
                    <label htmlFor="cash">
                      <span className={styles.optionTitle}>Thanh toán khi nhận hàng</span>
                      <span className={styles.optionDescription}>Thanh toán khi nhận sách</span>
                    </label>
                  </div>
                  <div className={styles.paymentOption}>
                    <input type="radio" id="bank-transfer" name="paymentMethod" value="BankTransfer" 
                      checked={formData.paymentMethod === "BankTransfer"} onChange={handleInputChange}
                    />
                    <label htmlFor="bank-transfer">
                      <span className={styles.optionTitle}>Chuyển khoản ngân hàng</span>
                      <span className={styles.optionDescription}>Chuyển khoản qua ngân hàng</span>
                    </label>
                  </div>
                </div>
              </div>

              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
              <button type="submit" className={styles.checkoutButton} disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất thuê"}
              </button>
            </form>
          </div>

          <div className={styles.orderSummaryContainer}>
            {/* Hiển thị các item trong đơn hàng*/}
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.book.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.book.imageList ? item.book.imageList[0].url : '/auth.jpg'} alt={item.title} className={styles.itemThumbnail} />
                      {item.quantity > 1 && <span className={styles.itemQuantity}>{item.quantity}</span>}
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item && item.book.name}</h3>
                      <p className={styles.itemAuthor}>{item.author && item.book.author.name}</p>
                      <div className={styles.itemRentDetails}>
                        <span className={styles.itemRentDays}>Thời gian thuê: {item.rentedDay} ngày</span>
                      </div>
                      <div className={styles.itemPrice}>
                        {(item.book.rentalPrice * item.quantity * Math.floor(item.rentedDay/7)).toLocaleString("vi-VN")}đ
                        <span className={styles.depositAmount}>
                          {" "}
                          (Tiền cọc: {(item.book.depositPrice*item.quantity).toLocaleString("vi-VN")}đ)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Tổng số lượng:</span>
                  <span>{getCartItemCount(true)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng tiền cọc:</span>
                  <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng phí thuê:</span>
                  <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
                {formData.deliveryMethod === "Online" && (
                  <div className={styles.summaryRow}>
                    <span>Phí vận chuyển ({formData.shippingMethod === "Express" ? "Nhanh" : "Tiêu chuẩn"}):</span>
                    <span>{formData.shippingMethod === "Express" ? "10.000đ" : "Miễn phí"}</span>
                  </div>
                )}

                {/* date nhan du kien */}
                <div className={styles.summaryRow}>
                  <span>{formData.deliveryMethod === "Online" ? "Ngày nhận dự kiến:" : "Ngày lấy sách:"}</span>
                  <span className={styles.expectedDate}>{getExpectedDate()}</span>
                </div>

                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span>Tổng thanh toán:</span>
                  <span>
                    {(
                      getTotalPrice() + (getTotalDeposit()) + 
                      (formData.deliveryMethod === "Online"
                        ? formData.shippingMethod === "Express"
                          ? 10000
                          : 0
                        : 0)
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
              </div>

              <div className={styles.rentalNote}>
                <p>
                  <strong>Lưu ý:</strong> <br/>
                  - Số tiền cọc sẽ được hoàn lại khi bạn trả sách trong tình trạng tốt.<br/>
                  - Thời gian thuê sách sẽ được tính từ ngày nhận hàng
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
