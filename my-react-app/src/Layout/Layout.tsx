import { Outlet, useLocation } from 'react-router-dom';
import { LogoForLogin, LogoForDashboard } from '../Logo/Logo';
import Navbar from '../Navbar_Component/Navbar';

import './Layout.css';

function Layout() {
  const Location = useLocation();
  const isLogin = Location.pathname.includes('login');
const titleLocation = useLocation();
   
        const getPageTitle = () => {
    if (titleLocation.pathname === "/StaffList") return "Staff List";
    if (titleLocation.pathname === "/addStaff") return "Add Staff";
    if (titleLocation.pathname === "/updateStaff") return "Update Staff";
    if (titleLocation.pathname === "/profile") return "Your Profile";
       return "Dashboard";
  }
  return (
    <div className="layout-container">
      {isLogin ? <LogoForLogin /> : <LogoForDashboard />}

      <div className="layout-body">
        {!isLogin && <Navbar />}
        <main className="layout-content">
            {!isLogin && <h1 className="page-title">{getPageTitle()}</h1>}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;