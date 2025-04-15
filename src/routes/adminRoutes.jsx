
import Dashboard from "../pages/adminPages/dashboard/Dashboard";
import ManagerBook from "../pages/adminPages/dashboard/ManagerBook"
// import UserManagement from "../pages/adminPages/dashboard/UserManagement";
const routes = [
    {
      path: "/admin",
      element: <Dashboard/>,
     
    },{
      path:"/admin/managerBook",
      element:<ManagerBook/>
    }
    // ,{
    //   path:"/admin/users",
    //   element:<UserManagement/>
    // }
  ];

export default routes;