import AdminApp from "../AdminApp";
import Home from '../pages/adminPages/home/Home';
import BookManager from '../pages/adminPages/bookManager/BookManager';
import CategoryManager from "../pages/adminPages/categoryManager/CategoryManager";
import AuthorManager from "../pages/adminPages/authorManager/AuthorManager";
import UserManager from "../pages/adminPages/userManager/UserManager";
import OrderManager from "../pages/adminPages/orderManager/OrderManager";
import ReturnManager from "../pages/adminPages/returnManager/ReturnManager";
import RentalBookManager from "../pages/adminPages/rentalBookManager/RentalBookManager";
import BranchManager from "../pages/adminPages/branchManager/BranchManager";
import { RequireRole } from "../components/RouteGuards";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <RequireRole allowedRoles={["SUPER_ADMIN"]}>
        <AdminApp />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'books-manage', element: <BookManager /> },
      { path: 'categories-manage', element: <CategoryManager/> },
      { path: 'authors-manage', element: <AuthorManager/> },
      { path: 'users-manage', element: <UserManager/> },
      { path: 'orders-manage', element: <OrderManager/> },
      { path: 'returns-manage', element: <ReturnManager/> },
      { path: 'rentals-manage', element: <RentalBookManager/> },
      { path: 'branchs-manage', element: <BranchManager/> }
    ]
  }
];
export default adminRoutes;