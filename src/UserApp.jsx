import { CartProvider } from "./contexts/CartContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import { Outlet } from "react-router-dom"
import Navbar from "./components/userComponents/navBar/NavBar"
import Footer from "./components/userComponents/footer/Footer"
import styles from "./styles/userStyles/UserApp.module.css"

function UserApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <div className={styles.userAppContainer}>
            <Navbar />
            <main className={styles.userAppMain}>
              <Outlet />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default UserApp
