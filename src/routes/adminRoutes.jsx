import AdminApp from "../AdminApp";
import Home from '../pages/adminPages/home/Home';
import BookManager from '../pages/adminPages/bookManager/BookManager';
import CategoryManager from "../pages/adminPages/categoryManager/CategoryManager";
import AuthorManager from "../pages/adminPages/authorManager/AuthorManager";
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
        path: 'category-manage',
        element: <CategoryManager/>
      },
      {
        path: 'author-manage',
        element: <AuthorManager/>
      }
    ]
  }
]
export default routes;