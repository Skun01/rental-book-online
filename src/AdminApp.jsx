import { Outlet } from "react-router-dom";
import SideBar from './components/adminComponents/sideBar/SideBar'
import "./styles/adminStyles/App.css"
import Header from './components/adminComponents/header/Header'
const AdminApp = () => {
  return (
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
  );
};

export default AdminApp;
