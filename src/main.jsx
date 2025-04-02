import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const routes = [...userRoutes, ...adminRoutes];
const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
