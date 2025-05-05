import AdminApp from "../AdminApp";
import Dashboard from "../pages/adminPages/dashboard/Dashboard"
import ManagerBook from "../pages/adminPages/dashboard/ManagerBook"
import ManagerUsers from "../pages/adminPages/dashboard/UserManagement"
import ThongKe from "../pages/adminPages/dashboard/ThongKe"
import Hire from "../pages/adminPages/dashboard/HireBook"
const routes= [
  {
    path:"/admin",
    element:<AdminApp/>
    ,
    children:[
      {
        path:"dashboard",
        element:<Dashboard/>
      },
      { path:"managerBook",
        element:<ManagerBook/>
      },
      {
        path:"thongKe",
        element:<ThongKe/>

      },{
        path:"borrows",
        element:<Hire/>
      }
        ,
      { 
        path:"managerUsers",
        element:<ManagerUsers/>
      }
    ]
  }
]
export default routes;