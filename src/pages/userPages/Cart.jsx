"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import "./Cart.css"

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading cart data
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.book.available_quantity) {
      updateQuantity(item.id, newQuantity)
    }
  }

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId)
  }

  const { rental: rentalTotal, deposit: depositTotal } = getCartTotal()
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const proceedToCheckout = () => {
    navigate("/checkout")
  }

  if (loading) {
    return (
      <div className="cart-container loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <Link to="/books" className="browse-books-button">
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <span className="header-product">Product</span>
            <span className="header-price">Price</span>
            <span className="header-quantity">Quantity</span>
            <span className="header-total">Total</span>
          </div>

          {cart.map((item) => {
            const itemRentalTotal = item.book.rental_price * item.quantity
            const itemDepositTotal = item.book.deposit_price * item.quantity

            return (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <div className="item-image">
                    <img
                      src={item.book.images?.find((img) => img.is_cover)?.url || "/placeholder.svg"}
                      alt={item.book.title}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.book.title}</h3>
                    <p className="item-author">by {item.book.authors?.map((author) => author.name).join(", ")}</p>
                    <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <div className="price-row">
                    <span className="price-label">Rental:</span>
                    <span className="price-value">{item.book.rental_price.toLocaleString()} VND</span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">Deposit:</span>
                    <span className="price-value">{item.book.deposit_price.toLocaleString()} VND</span>
                  </div>
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      disabled={item.quantity >= item.book.available_quantity}
                    >
                      +
                    </button>
                  </div>
                  <span className="availability">{item.book.available_quantity} available</span>
                </div>

                <div className="item-total">
                  <div className="total-row">
                    <span className="total-label">Rental:</span>
                    <span className="total-value">{itemRentalTotal.toLocaleString()} VND</span>
                  </div>
                  <div className="total-row">
                    <span className="total-label">Deposit:</span>
                    <span className="total-value">{itemDepositTotal.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Total Rental Fee:</span>
            <span>{rentalTotal.toLocaleString()} VND</span>
          </div>

          <div className="summary-row">
            <span>Total Deposit:</span>
            <span>{depositTotal.toLocaleString()} VND</span>
          </div>

          <div className="summary-row total">
            <span>Total Payment:</span>
            <span>{(rentalTotal + depositTotal).toLocaleString()} VND</span>
          </div>

          <div className="deposit-note">
            <p>Note: The deposit amount will be refunded when you return the books in good condition.</p>
          </div>

          <button className="checkout-button" onClick={proceedToCheckout}>
            Proceed to Checkout
          </button>

          <Link to="/books" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart

