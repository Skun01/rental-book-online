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
        path: "/search",
        element: <ListBookPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "books",
        element: <ListBookPage />,
      },
      {
        path: "authors",
        element: <ListPage pageData={"authors"} />,
      },
      {
        path: "categories",
        element: <ListPage pageData={"categories"} />,
      },
      {
        path: "categories/:id",
        element: <ListBookPage pageTitle={'category'} />
      },
      {
        path: "books/:id",
        element: <BookDetailsPage/>,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: 'checkout/success',
        element: <OrderSuccessPage />
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
      {
        path: '/rented-books',
        element: <RentedBooksPage/>
      },
      {
        path: '/return-books',
        element: <ReturnBooksPage/>
      },
      {
        path: '/return-success',
        element: <ReturnSuccessPage/>
      }
    ],
  },
]

export default userRoutes
