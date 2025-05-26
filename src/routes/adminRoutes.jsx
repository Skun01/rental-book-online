import AdminApp from "../AdminApp";
import Home from '../pages/adminPages/home/Home';
import BookManager from '../pages/adminPages/bookManager/BookManager';
import CategoryManager from "../pages/adminPages/categoryManager/CategoryManager";
import AuthorManager from "../pages/adminPages/authorManager/AuthorManager";
import UserManager from "../pages/adminPages/userManager/UserManager";
import OrderManager from "../pages/adminPages/orderManager/OrderManager";
const routes= [
  {
    path:"/admin",
    element: <AdminApp />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'books-manage',
        element: <BookManager />,
      },
      {
        path: 'categories-manage',
        element: <CategoryManager/>
      },
      {
        path: 'authors-manage',
        element: <AuthorManager/>
      },
      {
        path: 'users-manage',
        element: <UserManager/>
      },
      {
        path: 'orders-manage',
        element: <OrderManager/>  
      }
    ]
  }
]
export default routes;