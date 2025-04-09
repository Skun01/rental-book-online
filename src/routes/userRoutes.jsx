import { Navigate } from "react-router-dom"
import UserApp from "../UserApp"
import Login from "../pages/Login"
import Register from "../pages/Register";
import Dashboard from "../pages/userPages/Dashboard";
import BooksPage from "../pages/userPages/BooksPage"
import BookDetailPage from "../pages/userPages/BookDetailPage"
import Cart from "../pages/userPages/Cart"
// import Checkout from "../pages/userPages/Checkout"
// import RentalConfirmation from "../pages/userPages/RentalConfirmation"
// import OrderTracking from "../pages/userPages/OrderTracking"
// import UserProfile from "../pages/userPages/UserProfile"
// import RentalHistory from "../pages/userPages/RentalHistory"
// import OrderDetail from "../pages/userPages/OrderDetail"
import { UserProvider } from "../contexts/UserContext"

const userRoutes = [
  {
    path: "/",
    element: <UserApp />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "books",
        element: <BooksPage />,
      },
      {
        path: "books/:id",
        element: <BookDetailPage/>,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    //   {
    //     path: "checkout",
    //     element: <Checkout />,
    //   },
    //   {
    //     path: "rental-confirmation/:id",
    //     element: <RentalConfirmation />,
    //   },
    //   {
    //     path: "order-tracking/:id",
    //     element: <OrderTracking />,
    //   },
    //   {
    //     path: "profile",
    //     element: <UserProfile />,
    //   },
    //   {
    //     path: "rental-history",
    //     element: <RentalHistory />,
    //   },
    //   {
    //     path: "order/:id",
    //     element: <OrderDetail />,
    //   },
    ],
  },
  {
    path: "/login",
    element: (
      <UserProvider>
        <Login />
      </UserProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <UserProvider>
        <Register />
      </UserProvider>
    ),
  },
  // {
  //   path: "*",
  //   element: <Navigate to="/" replace />,
  // },
]

export default userRoutes

