import AdminApp from "../AdminApp";
import Home from '../pages/adminPages/home/Home';
const routes= [
  {
    path:"/admin",
    element: <AdminApp />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ]
  }
]
export default routes;