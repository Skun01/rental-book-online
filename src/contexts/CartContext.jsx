import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

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
    setCartItems((prevItems) => {
      // Check if the book is already in the cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === book.id)

      if (existingItemIndex !== -1) {
        // If the book is already in the cart, update the quantity
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity

        // Make sure the quantity doesn't exceed available quantity
        updatedItems[existingItemIndex].quantity = Math.min(newQuantity, book.available_quantity)

        return updatedItems
      } else {
        // If the book is not in the cart, add it
        return [...prevItems, { ...book, quantity }]
      }
    })

    // Show success notification
    return true
  }

  // Update item quantity
  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(bookId)
    }

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === bookId) {
          // Make sure the quantity doesn't exceed available quantity
          const newQuantity = Math.min(quantity, item.available_quantity)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    })
  }

  // Remove item from cart
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId))
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

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalDeposit,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
