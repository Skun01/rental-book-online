import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [totalItems, setTotalItems] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        updateTotalItems(parsedCart)
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // If there's an error, initialize with empty cart
      setCart([])
      setTotalItems(0)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
      updateTotalItems(cart)
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cart])

  const updateTotalItems = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    setTotalItems(total)
  }

  const addToCart = (book, quantity = 1) => {
    setCart((prevCart) => {
      // Check if the book is already in the cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === book.id)

      if (existingItemIndex !== -1) {
        // If the book is already in the cart, update the quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        }
        return updatedCart
      } else {
        // If the book is not in the cart, add it
        return [
          ...prevCart,
          {
            id: book.id,
            book,
            quantity,
          },
        ]
      }
    })
  }

  const updateQuantity = (bookId, quantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === bookId) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const removeFromCart = (bookId) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.id !== bookId)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce(
      (totals, item) => {
        const rentalPrice = item.book.rental_price || 0
        const depositPrice = item.book.deposit_price || 0

        return {
          rental: totals.rental + rentalPrice * item.quantity,
          deposit: totals.deposit + depositPrice * item.quantity,
        }
      },
      { rental: 0, deposit: 0 },
    )
  }

  const calculateTotal = (type) => {
    return cart.reduce((total, item) => {
      const price = type === "rental" ? item.book.rental_price : item.book.deposit_price
      return total + (price || 0) * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

