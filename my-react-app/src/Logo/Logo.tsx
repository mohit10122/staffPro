import './Logo.css';
import { FaUserCircle } from "react-icons/fa";

function LogoForLogin(){
  
    return(
<div>
    <div className="logoForLogin">
    <h1><span style={{ color: '#2563eb' }}>Staff</span>
    <span style={{ color: '#10b981' }}>Pro</span></h1>
   
    </div>
</div>
    )
}

function LogoForDashboard(){
      const staffName = localStorage.getItem("staffName") ;
   return(
        <div>
    <div className="logoForDashboard">
        <div className='DashboardLogo'>
    <h1><span style={{ color: '#2563eb' }}>Staff</span>
    <span style={{ color: '#10b981' }}>Pro</span></h1>
    </div>
        <div className="UserName">
    <FaUserCircle size={30} />
    
    <span>{staffName}</span>
    </div>
    </div>
   
    </div>
    )
}
export {LogoForLogin,LogoForDashboard};