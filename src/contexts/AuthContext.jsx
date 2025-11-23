import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        setCurrentUser(null)
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (userData, authToken) => {
    setCurrentUser(userData)
    try {
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", authToken)
    } catch (error) {
      console.error("Error saving user data to localStorage:", error)
    }
  }

  const logout = () => {
    navigate('/')
    setCurrentUser(null)

    try {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("cart")
    } catch (error) {
      console.error("Error removing user data from localStorage:", error)
    }
  }

  const updateProfile = (userData) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }))
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...currentUser,
        ...userData,
      }),
    )
    return true
  }

  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
