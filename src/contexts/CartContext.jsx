import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"
import axios from "axios"

const CartContext = createContext()
export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { showToast } = useToast()

  // get init cart items
  useEffect(() => {
    async function getCart() {
      try {
        const cart = localStorage.getItem('cart')
        if (cart) {
          setCartItems(JSON.parse(cart))
        } else {
          //get data from back end but will be handle later
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Error parsing localStorage cart:", error)
      }
    }
    getCart()
  }, [])

  //handle first time get cart item from database
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

//cart structure:
//[{book,rentedDay, quantity},....]
  const addToCart = async (book, rentedDay = 7, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.book.id === book.id)
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity
        updatedItems[existingItemIndex].quantity = Math.min(newQuantity, book.stock)
        return updatedItems
      } else {
        return [...prevItems, { book, rentedDay, quantity }]
      }
    })
    showToast({
      type: "success",
      message: `Đã thêm ${book.name} vào giỏ hàng`,
    })
    return true
  }

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(bookId)
    }
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.book.id === bookId) {
          const newQuantity = Math.min(quantity, item.book.stock)
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
    setCartItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId))
    showToast({
      type: "info",
      message: "Đã xóa sách khỏi giỏ hàng",
    })
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.book.rentalPrice * item.quantity, 0)
  }

  // Calculate total deposit
  const getTotalDeposit = () => {
    return cartItems.reduce((total, item) => total + item.book.depositPrice * item.quantity, 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const updateRentDays = (bookId, days) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.book.id === bookId ? { ...item, rentedDay: days } : item
      )
    )
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
    totalItems: cartItems.length,
    cart: cartItems,
    updateRentDays
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
