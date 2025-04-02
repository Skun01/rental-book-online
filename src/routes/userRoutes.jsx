import Login from '../pages/Login';
import Register from '../pages/Register';
import UserHome from '../pages/userPages/UserHome';
const routes = [
    {
        path: '/user',
        element: <UserHome/>
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