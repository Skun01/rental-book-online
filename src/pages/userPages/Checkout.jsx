import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const { cart, totalItems, calculateTotal } = useCart();
  const navigate = useNavigate();
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const depositTotal = calculateTotal("deposit");
  const rentalFeeTotal = calculateTotal("rental");

  useEffect(() => {
    if (totalItems === 0) {
      navigate("/cart");
    }
  }, [totalItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc";
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.deliveryMethod === "home-delivery") {
      if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc";
      if (!formData.city.trim()) newErrors.city = "Thành phố là bắt buộc";
      if (!formData.district.trim()) newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (formData.paymentMethod === "bank-transfer" && !formData.accountNumber.trim()) {
      newErrors.accountNumber = "Số tài khoản là bắt buộc";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Bạn phải đồng ý với các điều khoản và điều kiện";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const orderDetails = {
          orderId: "ORD-" + Math.floor(Math.random() * 10000),
          orderDate: new Date().toLocaleDateString(),
          items: cart,
          totalDeposit: depositTotal,
          totalRentalFee: rentalFeeTotal,
          deliveryMethod: formData.deliveryMethod === "library-pickup" ? "Nhận tại thư viện" : "Giao hàng tận nơi",
          pickupLocation:
            formData.deliveryMethod === "library-pickup"
              ? formData.pickupLocation === "main-library"
                ? "Thư viện chính"
                : formData.pickupLocation === "branch-library"
                  ? "Thư viện chi nhánh"
                  : "Thư viện trường học"
              : "",
          address:
            formData.deliveryMethod === "home-delivery"
              ? `${formData.address}, ${formData.district}, ${formData.city}`
              : "",
          paymentMethod:
            formData.paymentMethod === "e-wallet"
              ? "Ví điện tử"
              : formData.paymentMethod === "bank-transfer"
                ? "Chuyển khoản ngân hàng"
                : "Thanh toán khi nhận hàng",
          rentalPeriod: "14 ngày",
          estimatedReadyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };

        navigate("/rental-confirmation", { state: { orderDetails } });
      } catch (error) {
        console.error("Lỗi khi xử lý đơn hàng:", error);
        setErrors({ submit: "Có lỗi khi xử lý đơn hàng. Vui lòng thử lại." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (totalItems === 0) {
    return <div className="loading">Đang chuyển hướng đến giỏ hàng...</div>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1>Thanh Toán</h1>

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
                    <span className={styles.optionDescription}>Nhận sách tại một trong những địa điểm thư viện của chúng tôi</span>
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
                <div className={styles.addressFields}>
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
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.book.images?.find((img) => img.is_cover)?.url || "/placeholder.svg"} alt={item.book.title} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3>{item.book.title}</h3>
                    <p className={styles.itemAuthor}>
                      bởi{" "}
                      {item.book.authors && item.book.authors.length > 0
                        ? item.book.authors.map((author) => author.name).join(", ")
                        : item.book.author || "Tác giả không xác định"}
                    </p>
                    <div className={styles.itemPricing}>
                      <span className={styles.depositAmount}>
                        Tiền cọc: ₫{(item.book.deposit_price || item.book.deposit).toLocaleString()}
                      </span>
                      <span className={styles.rentalFee}>Phí thuê: ₫{item.book.rental_price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Tổng số lượng:</span>
                <span>{totalItems}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tổng tiền cọc:</span>
                <span>₫{depositTotal.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tổng phí thuê:</span>
                <span>₫{rentalFeeTotal.toLocaleString()}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                <span>Tổng thanh toán:</span>
                <span>₫{(depositTotal + rentalFeeTotal).toLocaleString()}</span>
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
  );
};

export default Checkout;