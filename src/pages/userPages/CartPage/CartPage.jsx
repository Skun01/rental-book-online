import { Link, useNavigate } from "react-router-dom"
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import styles from "./CartPage.module.css"
import { useCart } from "../../../contexts/CartContext"

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalDeposit, updateRentDays } = useCart()
  const navigate = useNavigate()
  const [showCommonDatePicker, setShowCommonDatePicker] = useState(false)
  const commonDateInputRef = useRef(null)
  const [commonDate, setCommonDate] = useState(-1)

  const handleQuantityChange = (bookId, quantity) => {
    updateQuantity(bookId, quantity)
  }

  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId)
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  // xử lý ngày tháng
  const addDays = (days) => {
    const today = new Date()
    today.setDate(today.getDate() + days)
    return today.toLocaleDateString("vi-VN")
  }

  // Xử lý chọn ngày trả chung
  const handleCommonReturnDate = () => {
    if(!commonDateInputRef.current.value){
      alert('Vui lòng chọn ngày');
      return;
    }
    if (!showCommonDatePicker) {
      setShowCommonDatePicker(true)
      return;
    }

    const selectedDateMs = Date.parse(commonDateInputRef.current.value)
    const todayMs = Date.parse(new Date().toISOString().slice(0, 10))
    const diffDays = Math.round((selectedDateMs - todayMs) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      alert("Bạn phải thuê ít nhất 7 ngày!")  
      return
    }

    // Cập nhật số ngày thuê cho tất cả sách
    cartItems.forEach((item) => {
      updateRentDays(item.id, diffDays)
    })

    setCommonDate(diffDays)
    setShowCommonDatePicker(false)
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartMainContent}>
              <div className={styles.cartHeader}>
                <div className={styles.commonReturnDateSection}>
                  <h2 className={styles.sectionTitle}>Chọn ngày trả chung</h2>
                  <div className={styles.commonReturnDateContent}>
                    <div className={styles.commonReturnDateInfo}>
                      <p>Chọn một ngày trả chung cho tất cả sách trong giỏ hàng</p>
                    </div>
                    <div className={styles.commonReturnDateActions}>
                      {!showCommonDatePicker ? (
                        <button className={styles.commonReturnDateButton} onClick={() => setShowCommonDatePicker(true)}>
                          Chọn ngày trả chung
                        </button>
                      ) : (
                        <div className={styles.commonDatePickerContainer}>
                          <div className={styles.customDatePicker}>
                            <input
                              type="date"
                              className={styles.customDateInput}
                              placeholder="Chọn ngày trả"
                              ref={commonDateInputRef}
                              min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]}
                            />
                          </div>
                          <button className={styles.customDateConfirm} onClick={handleCommonReturnDate}>
                            Xác nhận
                          </button>
                          <button className={styles.cancelDateButton} onClick={() => setShowCommonDatePicker(false)}>
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <CartItemsList
                cartItems={cartItems}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                updateRentDays={updateRentDays}
                addDays={addDays}
                commonDate={commonDate}
              />
            </div>
            <CartSummary totalPrice={getTotalPrice()} totalDeposit={getTotalDeposit()} onCheckout={handleCheckout} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage


const EmptyCart = () => (
  <div className={styles.emptyCart}>
    <ShoppingCart size={64} />
    <h2>Giỏ hàng trống</h2>
    <p>Bạn chưa thêm sách nào vào giỏ hàng.</p>
    <Link to="/search" className={styles.continueShopping}>
      Tiếp tục tìm sách
    </Link>
  </div>
)

const CartItem = ({ item, onQuantityChange, onRemoveItem, updateRentDays, addDays, commonDate }) => {
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [otherDate, setOtherDate] = useState(1)
  const inputOtherDate = useRef(null)
  useEffect(()=>{
    setOtherDate(commonDate)
  }, [commonDate])
  useEffect(()=>{
    if(item.rentedDay !== 7 && item.rentedDay !== 14 && item.rentedDay !== 30){
      setOtherDate(item.rentedDay)
    }
  }, [item])
  // Xử lý chọn số ngày thuê
  const handleClickRentDate = (date) => {
    if (item.rentedDay !== date) {
      updateRentDays(item.id, date)
    }
    if (showCustomDate && (date === 7 || date === 14 || date === 30 || date === otherDate)) {
      setShowCustomDate(false)
    }
  }

  const handleClickRentOtherDate = () => {
    if (!showCustomDate) {
      setShowCustomDate(!showCustomDate)
    }
  }

  // Xử lý lấy ngày khi chọn ngày khác
  const handleGetOtherDay = () => {
    const selectedDateMs = Date.parse(inputOtherDate.current.value)
    if(!selectedDateMs){
      alert("Vui lòng chọn ngày!")
      return;
    }
    const todayMs = Date.parse(new Date().toISOString().slice(0, 10))
    const diffDays = Math.round((selectedDateMs - todayMs) / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
      alert("Bạn phải thuê ít nhất 7 ngày!")
      updateRentDays(item.id, 7)
      return
    }

    updateRentDays(item.id, diffDays)
    setOtherDate(diffDays)
    setShowCustomDate(false)
  }

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemMain}>
        <div className={styles.productCol}>
          <div className={styles.productInfo}>
            <Link to={`/books/${item.id}`} className={styles.productImageLink}>
              <img src={item.imageList[0].url || "/placeholder.svg"} alt={item.name} className={styles.productImage} />
            </Link>
            <div className={styles.productDetails}>
              <Link to={`/books/${item.id}`} className={styles.productTitle}>
                {item.name}
              </Link>
              <div className={styles.productAuthor}>{item.author ? item.author.name : "Đang cập nhật"}</div>
              <div className={styles.productDeposit}>Đặt cọc: {item.depositPrice ? item.depositPrice.toLocaleString("vi-VN"): 0}đ</div>
            </div>
          </div>
        </div>

        <div className={styles.priceCol}>
          <div className={styles.productPrice}>
            {item.rentalPrice.toLocaleString("vi-VN")}đ<span className={styles.pricePeriod}>/Tuần</span>
          </div>
        </div>

        <div className={styles.quantityCol}>
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <input type="number" min="1" max={item.stock} value={item.quantity}
              onChange={(e) => onQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
              className={styles.quantityInput}
            />
            <button className={styles.quantityButton} onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.totalCol}>
          <div className={styles.itemTotal}>
            {(item.rentalPrice * item.quantity * Math.floor(item.rentedDay/7)).toLocaleString("vi-VN")}đ
          </div>
        </div>

        <div className={styles.actionCol}>
          <button className={styles.removeButton} onClick={() => onRemoveItem(item.id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className={styles.cartItemRentOptions}>
        <div className={styles.rentDate}>
          <div className={styles.rentOptionTitle}>Số ngày thuê</div>
          <div className={styles.rentDateList}>
            <div
              className={`${styles.rentDateOption} ${item.rentedDay === 7 ? styles.active : ""}`}
              onClick={() => handleClickRentDate(7)}
            >
              7 ngày
            </div>
            <div
              className={`${styles.rentDateOption} ${item.rentedDay === 14 ? styles.active : ""}`}
              onClick={() => handleClickRentDate(14)}
            >
              14 ngày
            </div>
            <div
              className={`${styles.rentDateOption} ${item.rentedDay === 30 ? styles.active : ""}`}
              onClick={() => handleClickRentDate(30)}
            >
              30 ngày
            </div>

            {otherDate == -1 || ([7, 14, 30].includes(otherDate))? '' : (
              <div className={`${styles.rentDateOption} ${item.rentedDay === otherDate? styles.active : ''}`}
                onClick = {()=>handleClickRentDate(otherDate)}>
                {otherDate} ngày
              </div>
            )}
            <div
              className={`${styles.rentDateOption}`}
              onClick={handleClickRentOtherDate}
            >
              khác
            </div>
            {/* Container chọn ngày tùy chỉnh - mặc định ẩn */}
            <div className={`${styles.customDateContainer} ${showCustomDate ? "" : styles.hidden}`}>
              <label className={styles.customDateLabel}>Chọn ngày trả</label>
              <div className={styles.customDatePicker}>
                <input
                  type="date"
                  className={styles.customDateInput}
                  placeholder="Chọn ngày trả"
                  ref={inputOtherDate}
                  min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]}
                />
              </div>
              <button className={styles.customDateConfirm} onClick={handleGetOtherDay}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CartItemsList = ({ cartItems, onQuantityChange, onRemoveItem, updateRentDays, addDays, commonDate }) => (
  <div className={styles.cartItems}>
    <div className={styles.cartItemsHeader}>
      <div className={styles.productCol}>Sản phẩm</div>
      <div className={styles.priceCol}>Giá thuê</div>
      <div className={styles.quantityCol}>Số lượng</div>
      <div className={styles.totalCol}>Tổng thuê</div>
      <div className={styles.actionCol}></div>
    </div>

    {cartItems.map((item) => (
      <CartItem
        key={item.id}
        item={item}
        onQuantityChange={onQuantityChange}
        onRemoveItem={onRemoveItem}
        updateRentDays={updateRentDays}
        addDays={addDays}
        commonDate={commonDate}
      />
    ))}
  </div>
)

const CartSummary = ({ totalPrice, totalDeposit, onCheckout }) => (
  <div className={styles.cartSummary}>
    <h2 className={styles.summaryTitle}>Tổng giỏ hàng</h2>

    <div className={styles.summaryRow}>
      <span>Tổng tiền thuê:</span>
      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
    </div>

    <div className={styles.summaryRow}>
      <span>Tổng tiền đặt cọc:</span>
      <span>{totalDeposit.toLocaleString("vi-VN")}đ</span>
    </div>

    <div className={styles.summaryTotal}>
      <span>Tổng thanh toán:</span>
      <span>{(totalPrice + totalDeposit).toLocaleString("vi-VN")}đ</span>
    </div>

    <div className={styles.summaryNote}>
      <p>Lưu ý: Tiền cọc sẽ được hoàn trả khi người dùng trả sách</p>
    </div>

    <div className={styles.cartButtons}>
      <button className={styles.checkoutButton} onClick={onCheckout}>
        <span>Tiến hành thanh toán</span>
        <ArrowRight size={18} />
      </button>
      <Link to="/search" className={styles.continueShoppingLink}>
        Tiếp tục tìm sách
      </Link>
    </div>
  </div>
)
