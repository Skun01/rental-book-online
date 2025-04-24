"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { showToast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setCartItems([])
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // Add item to cart
  const addToCart = (book, quantity = 1) => {
    // Kiểm tra xem sách đã có trong giỏ hàng chưa trước khi thêm
    const existingItemIndex = cartItems.findIndex((item) => item.id === book.id)
    const existingItem = existingItemIndex !== -1 ? cartItems[existingItemIndex] : null

    let wasAdded = false

    setCartItems((prevItems) => {
      if (existingItemIndex !== -1) {
        // Nếu sách đã có trong giỏ hàng, cập nhật số lượng
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity

        // Đảm bảo số lượng không vượt quá số lượng có sẵn
        updatedItems[existingItemIndex].quantity = Math.min(newQuantity, book.stock || 10)

        // Kiểm tra xem số lượng có thay đổi không
        wasAdded = updatedItems[existingItemIndex].quantity > prevItems[existingItemIndex].quantity

        return updatedItems
      } else {
        // Nếu sách chưa có trong giỏ hàng, thêm mới
        wasAdded = true
        return [...prevItems, { ...book, quantity }]
      }
    })

    // Chỉ hiển thị thông báo nếu sách chưa có trong giỏ hàng hoặc số lượng đã thay đổi
    if (!existingItem || wasAdded) {
      showToast({
        type: "success",
        message: `Đã thêm "${book.title}" vào giỏ hàng!`,
      })
    }

    return true
  }

  // Update item quantity
  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(bookId)
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === bookId) {
          // Make sure the quantity doesn't exceed available quantity
          const newQuantity = Math.min(quantity, item.stock)
          return { ...item, quantity: newQuantity }
        }
        return item
      })

      return updatedItems
    })

    showToast({
      type: "info",
      message: "Đã cập nhật số lượng sách trong giỏ hàng",
    })
  }

  // Remove item from cart
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId))

    showToast({
      type: "info",
      message: "Đã xóa sách khỏi giỏ hàng",
    })
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.rental_price * item.quantity, 0)
  }

  // Calculate total deposit
  const getTotalDeposit = () => {
    return cartItems.reduce((total, item) => total + item.deposit_price * item.quantity, 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Calculate total for a specific type (rental or deposit)
  const calculateTotal = (type) => {
    if (type === "rental") {
      return cartItems.reduce((total, item) => total + item.book.rental_price * item.quantity, 0)
    } else if (type === "deposit") {
      return cartItems.reduce((total, item) => total + item.book.deposit_price * item.quantity, 0)
    }
    return 0
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalDeposit,
    getCartItemCount,
    calculateTotal,
    totalItems: cartItems.length,
    cart: cartItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
