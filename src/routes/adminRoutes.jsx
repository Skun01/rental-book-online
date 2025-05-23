import AdminApp from "../AdminApp";
import Home from '../pages/adminPages/home/Home';
import BookManager from '../pages/adminPages/bookManager/BookManager';
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
      }
    ]
  }
]
export default routes;