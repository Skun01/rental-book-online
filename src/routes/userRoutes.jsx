import UserApp from "../UserApp"
import HomePage from "../pages/userPages/HomePage/HomePage"
import ListBookPage from "../pages/userPages/listBookPage/ListBookPage"
import CartPage from "../pages/userPages/CartPage/CartPage"
import BookDetailsPage from "../pages/userPages/BookDetailsPage/BookDetailsPage"
import CheckoutPage from "../pages/userPages/CheckoutPage/CheckoutPage"
import OrderSuccessPage from "../pages/userPages/OrderSuccessPage/OrderSuccessPage"
import ProfilePage from "../pages/userPages/ProfilePage/ProfilePage"
import OrdersPage from "../pages/userPages/orderPage/OrdersPage"
import OrderDetailsPage from "../pages/userPages/OrderDetailsPage/OrderDetailsPage"
import ListPage from "../pages/userPages/listPage/ListPage"
import RentedBooksPage from "../pages/userPages/rentedBookPage/RentedBookPage"
import ReturnBooksPage from "../pages/userPages/returnBooksPage/ReturnBooksPage"
import ReturnSuccessPage from "../pages/userPages/returnSuccessPage/ReturnSuccessPage"
import { RequireRole } from "../components/RouteGuards";

const userRoutes = [
  {
    path: "/",
    element: <UserApp />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <ListBookPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "books", element: <ListBookPage /> },
      { path: "books/:id", element: <BookDetailsPage/> },
      
      { path: "authors", element: <ListPage pageData={"authors"} /> },
      { path: "authors/:id", element: <ListBookPage pageTitle={'author'} /> },
      { path: "categories", element: <ListPage pageData={"categories"} /> },
      { path: "categories/:id", element: <ListBookPage pageTitle={'category'} /> },
      {
        element: <RequireRole allowedRoles={["USER"]}><div/></RequireRole>, // Wrapper ảo để check quyền
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: 'checkout/:orderId/success', element: <OrderSuccessPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:orderId", element: <OrderSuccessPage /> },
          { path: 'rented-books', element: <RentedBooksPage/> },
          { path: 'return-books', element: <ReturnBooksPage/> },
          { path: 'return-success', element: <ReturnSuccessPage/> }
        ]
      }
    ],
  },
];
export default userRoutes
