import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"
import {useAuth} from "./AuthContext"
import axios from "axios"

const CartContext = createContext()
export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [backupCartItems, setBackupCartItems] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { showToast } = useToast()
  const {currentUser} = useAuth()
  
  useEffect(() => {
    async function getCart() {
      try {
        const cart = localStorage.getItem('cart')
        if (cart) {
          setCartItems(JSON.parse(cart))
        } else if(currentUser){
          const response = await axios.get(`http://localhost:8080/api/v1/cart/by/user/${currentUser.id}?page=0&size=10`,{
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            }
          })
          setCartItems(response.data.data.content)
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Error parsing localStorage cart:", error)
      }
    }
    getCart()
  }, [currentUser])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

//cart structure:
//[{book,rentedDay, quantity},....]
  const addToCart = async (book, rentedDay = 7, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex((item) => item.book.id === book.id)
    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity
      updatedItems[existingItemIndex].quantity = Math.min(newQuantity, book.stock)
      setCartItems(updatedItems)
    } else {
      setCartItems([...cartItems, {book, rentedDay, quantity }])
    }
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
          return {...item, quantity: newQuantity }
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
  const getPostCartItems = () => {
    const postCartItems = cartItems.map((item) => ({
      bookId: item.book.id,
      quantity: item.quantity,
      rentedDay: item.rentedDay,
    }))
    return postCartItems;
  }

  // xu ly add cart vao database
  const handlePostCart = async() => {
    try{
      await axios.post(`http://localhost:8080/api/v1/cart/update`, {
        userId: currentUser.id,
        books: getPostCartItems()
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      })
    }catch(err){
      console.log('there is a error when handle post cart items: ', err)
    }
    
  }

  // change cartItem temporarily
  const changeCartItemsTemporarily = (newCartItems) =>{
    setBackupCartItems(cartItems)
    setCartItems(newCartItems)
  }

  const restoreCartItems = () => {
    if(backupCartItems.length !== 0){
      setCartItems(backupCartItems)
      setBackupCartItems([])
    }
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.book.rentalPrice * item.quantity * Math.floor(item.rentedDay/7), 0)
  }

  const getTotalDeposit = () => {
    return cartItems.reduce((total, item) => total + item.book.depositPrice * item.quantity, 0)
  }

  const getCartItemCount = (temporarily) => {
    if(!cartItems) return 0
    let items
    if(temporarily) items = cartItems
    else{
      items = backupCartItems.length !== 0 ? backupCartItems : cartItems
    }
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const updateRentDays = (bookId, days) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.book.id === bookId ? {...item, rentedDay: days } : item
      )
    )
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    changeCartItemsTemporarily,
    restoreCartItems,
    getTotalPrice,
    getTotalDeposit,
    getCartItemCount,
    updateRentDays,
    setCartItems,
    getPostCartItems,
    handlePostCart,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
