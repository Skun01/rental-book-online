import Login from "../pages/Login"
import Register from "../pages/Register"
import UserApp from "../UserApp"
import HomePage from "../pages/userPages/HomePage/HomePage"
import SearchResultsPage from "../pages/userPages/SearchResultsPage/SearchResultsPage"
import { AuthProvider } from "../contexts/AuthContext"
import { CartProvider } from "../contexts/CartContext"
import { ToastProvider } from "../contexts/ToastContext"
import CartPage from "../pages/userPages/CartPage/CartPage"
import BookDetailsPage from "../pages/userPages/BookDetailsPage/BookDetailsPage"
import CheckoutPage from "../pages/userPages/CheckoutPage/CheckoutPage"
import OrderSuccessPage from "../pages/userPages/OrderSuccessPage/OrderSuccessPage"
import ProfilePage from "../pages/userPages/ProfilePage/ProfilePage"
import OrdersPage from "../pages/userPages/OrdersPage/OrdersPage"
import OrderDetailsPage from "../pages/userPages/OrderDetailsPage/OrderDetailsPage"

const userRoutes = [
  {
    path: "/",
    element: <UserApp />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchResultsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "books/:id",
        element: (
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <BookDetailsPage />
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        ),
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/orders/success",
        element: <OrderSuccessPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetailsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <Register />
      </AuthProvider>
    ),
  },
]

export default userRoutes
