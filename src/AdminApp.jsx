import { Outlet } from "react-router-dom";
import SideBar from './components/adminComponents/sideBar/SideBar'
import "./styles/adminStyles/App.css"
import Header from './components/adminComponents/header/Header'
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
const AdminApp = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="admin-app-container">
          <Header/>
          <main className="admin-main">
            <div className="admin-sidebar">
              <SideBar />
            </div>
            <div className="admin-main-content">
              <Outlet />
            </div>
          </main>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AdminApp;
