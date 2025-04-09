import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user data from localStorage on initial render
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token")

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser))
          setToken(savedToken)
        }
      } catch (error) {
        console.error("Error loading user data from localStorage:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)

    // Save to localStorage
    try {
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", authToken)
    } catch (error) {
      console.error("Error saving user data to localStorage:", error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    // Remove from localStorage
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } catch (error) {
      console.error("Error removing user data from localStorage:", error)
    }
  }

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData }
    setUser(updatedUser)

    // Update in localStorage
    try {
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating user data in localStorage:", error)
    }
  }

  return (
    <UserContext.Provider value={{ user, token, loading, login, logout, updateUser }}>{children}</UserContext.Provider>
  )
}

