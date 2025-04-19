"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on initial render
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
  const login = (userData) => {
    // In a real app, this would validate credentials with your backend
    // For demo purposes, we'll just set the user data
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  // Register function
  const register = (userData) => {
    // In a real app, this would send data to your backend
    // For demo purposes, we'll just set the user data
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  // Update user profile
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
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
