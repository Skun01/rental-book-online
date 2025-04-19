import Login from "../pages/Login"
import Register from "../pages/Register"
import UserApp from "../UserApp"
import { AuthProvider } from "../contexts/AuthContext" 

const userRoutes = [
  {
    path: "/",
    element: <UserApp />,
    children: [
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

