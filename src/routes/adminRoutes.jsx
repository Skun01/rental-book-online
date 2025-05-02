import AdminApp from "../AdminApp";
import Dashboard from "../pages/adminPages/dashboard/Dashboard"
import ManagerBook from "../pages/adminPages/dashboard/ManagerBook"
import ManagerUsers from "../pages/adminPages/dashboard/UserManagement"
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