"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import styles from "./ToastContext.module.css"

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Remove toast after timeout
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        // Mark the oldest toast for removal with animation
        setToasts((prevToasts) => {
          const updatedToasts = [...prevToasts]
          if (updatedToasts.length > 0) {
            updatedToasts[0] = { ...updatedToasts[0], isExiting: true }
          }
          return updatedToasts
        })

        // Actually remove the toast after animation completes
        const removalTimer = setTimeout(() => {
          setToasts((prevToasts) => prevToasts.slice(1))
        }, 500) // Increased to match new animation duration

        return () => clearTimeout(removalTimer)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [toasts])

  const showToast = ({ type, message }) => {
    const id = Date.now()

    // Giới hạn số lượng toast hiển thị cùng lúc
    setToasts((prevToasts) => {
      // Nếu có quá nhiều toast, loại bỏ toast cũ nhất
      if (prevToasts.length >= 3) {
        return [...prevToasts.slice(1), { id, type, message, isExiting: false }]
      }
      return [...prevToasts, { id, type, message, isExiting: false }]
    })
  }

  const removeToast = (id) => {
    // Mark toast for removal with animation
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)))

    // Actually remove after animation completes
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 500) // Increased to match new animation duration
  }

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className={styles.toastIcon} size={20} />
      case "error":
        return <AlertCircle className={styles.toastIcon} size={20} />
      case "info":
      default:
        return <Info className={styles.toastIcon} size={20} />
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[`toast${type2Class(toast.type)}`]} ${
              toast.isExiting ? styles.toastExit : ""
            }`}
          >
            <div className={styles.toastContent}>
              {getToastIcon(toast.type)}
              <span className={styles.toastMessage}>{toast.message}</span>
            </div>
            <button className={styles.toastClose} onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Helper function to convert toast type to class name
function type2Class(type) {
  switch (type) {
    case "success":
      return "Success"
    case "error":
      return "Error"
    case "info":
      return "Info"
    default:
      return "Info"
  }
}