import Login from "../pages/Login"
import Register from "../pages/Register"
import UserApp from "../UserApp"
import HomePage from "../pages/userPages/HomePage/HomePage"
import { AuthProvider } from "../contexts/AuthContext" 

const userRoutes = [
  {
    path: "/",
    element: <UserApp />,
    children: [
      {
        index: true,
        element: <HomePage />,
      }
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <Register />
      </AuthProvider>
    ),
  },
]

export default userRoutes

