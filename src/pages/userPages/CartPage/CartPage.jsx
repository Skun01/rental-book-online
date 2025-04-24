"use client"

import { Link, useNavigate } from "react-router-dom"
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"
import styles from "./CartPage.module.css"

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalDeposit } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = (bookId, quantity) => {
    updateQuantity(bookId, quantity)
  }

  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId)
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <ShoppingCart size={64} />
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa thêm sách nào vào giỏ hàng.</p>
            <Link to="/search" className={styles.continueShopping}>
              Tiếp tục tìm sách
            </Link>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <div className={styles.cartHeader}>
                <div className={styles.productCol}>Sản phẩm</div>
                <div className={styles.priceCol}>Giá thuê</div>
                <div className={styles.quantityCol}>Số lượng</div>
                <div className={styles.totalCol}>Tổng cộng</div>
                <div className={styles.actionCol}></div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.productCol}>
                    <div className={styles.productInfo}>
                      <Link to={`/books/${item.id}`} className={styles.productImageLink}>
                        <img src={item.cover_image} alt={item.title} className={styles.productImage} />
                      </Link>
                      <div className={styles.productDetails}>
                        <Link to={`/books/${item.id}`} className={styles.productTitle}>
                          {item.title}
                        </Link>
                        <div className={styles.productAuthor}>{item.author}</div>
                        <div className={styles.productDeposit}>
                          Đặt cọc: {item.deposit_price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceCol}>
                    <div className={styles.productPrice}>
                      {item.rental_price.toLocaleString("vi-VN")}đ<span className={styles.pricePeriod}>/tuần</span>
                    </div>
                  </div>

                  <div className={styles.quantityCol}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.available_quantity}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        className={styles.quantityInput}
                      />
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.available_quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.totalCol}>
                    <div className={styles.itemTotal}>
                      {(item.rental_price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>

                  <div className={styles.actionCol}>
                    <button className={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Tổng giỏ hàng</h2>

              <div className={styles.summaryRow}>
                <span>Tổng tiền thuê:</span>
                <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tổng tiền đặt cọc:</span>
                <span>{getTotalDeposit().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span>Tính khi thanh toán</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>Tổng thanh toán:</span>
                <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
              </div>

              <div className={styles.summaryNote}>
                <p>* Chưa bao gồm tiền đặt cọc và phí vận chuyển</p>
              </div>

              <div className={styles.cartButtons}>
                <button className={styles.checkoutButton} onClick={handleCheckout}>
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight size={18} />
                </button>
                <Link to="/search" className={styles.continueShoppingLink}>
                  Tiếp tục tìm sách
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
