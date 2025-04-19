"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading cart data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.book.available_quantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const { rental: rentalTotal, deposit: depositTotal } = getCartTotal();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className={styles.cartContainerLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.cartContainerEmpty}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>
            <ShoppingCart size={64} />
          </div>
          <h2>Giỏ Hàng Trống</h2>
          <p>Chưa có sách nào trong giỏ hàng của bạn.</p>
          <Link to="/books" className={styles.browseBooksButton}>
            Duyệt Sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1>Giỏ Hàng</h1>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          <div className={styles.cartHeader}>
            <span>Sản Phẩm</span>
            <span>Giá</span>
            <span>Số Lượng</span>
            <span>Tổng</span>
          </div>

          {cart.map((item) => {
            const itemRentalTotal = item.book.rental_price * item.quantity;
            const itemDepositTotal = item.book.deposit_price * item.quantity;

            return (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemProduct}>
                  <div className={styles.itemImage}>
                    <img
                      src={
                        item.book.images?.find((img) => img.is_cover)?.url ||
                        "/placeholder.svg"
                      }
                      alt={item.book.title}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3>{item.book.title}</h3>
                    <p className={styles.itemAuthor}>
                      bởi {item.book.authors?.map((author) => author.name).join(", ")}
                    </p>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className={styles.itemPrice}>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Thuê:</span>
                    <span className={styles.priceValue}>
                      ₫{item.book.rental_price}
                    </span>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Đặt cọc:</span>
                    <span className={styles.priceValue}>
                      ₫{item.book.deposit_price}
                    </span>
                  </div>
                </div>

                <div className={styles.itemQuantity}>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      disabled={item.quantity >= item.book.available_quantity}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.availability}>
                    {item.book.available_quantity} còn lại
                  </span>
                </div>

                <div className={styles.itemTotal}>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Tổng thuê:</span>
                    <span className={styles.totalValue}>
                      ₫{itemRentalTotal}
                    </span>
                  </div>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Tổng cọc:</span>
                    <span className={styles.totalValue}>
                      ₫{itemDepositTotal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.cartSummary}>
          <h2>Tóm Tắt Đơn Hàng</h2>

          <div className={styles.summaryRow}>
            <span>Tổng số sách:</span>
            <span>{totalItems}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Tổng phí thuê:</span>
            <span>₫{rentalTotal}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Tổng đặt cọc:</span>
            <span>₫{depositTotal}</span>
          </div>

          <div className={styles.summaryRowTotal}>
            <span>Tổng thanh toán:</span>
            <span>₫{(rentalTotal + depositTotal)}</span>
          </div>

          <div className={styles.depositNote}>
            <p>
              Lưu ý: Số tiền đặt cọc sẽ được hoàn lại khi bạn trả sách đúng hạn và
              trong tình trạng tốt.
            </p>
          </div>

          <button className={styles.checkoutButton} onClick={proceedToCheckout}>
            Thanh Toán
          </button>

          <Link to="/books" className={styles.continueShopping}>
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;