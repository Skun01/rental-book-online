import { CartProvider } from "./contexts/CartContext"
import { UserProvider } from "./contexts/UserContext"
import { Outlet } from "react-router-dom"
import Navbar from "./components/userComponents/navBar/NavBar"
import Footer from "./components/userComponents/footer/Footer"
import "./styles/userStyles/App.css"

function UserApp() {
  return (
    <UserProvider>
      <CartProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  )
}

export default UserApp

