import Login from '../pages/Login';
import Register from '../pages/Register';
import UserHome from '../pages/userPages/UserHome';
import Dashboard from '../pages/dashboard/Dashboard';
const routes = [
    {
        path: '/',
        element: <Dashboard/>
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/register',
        element: <Register/>
    }
]

export default routes;