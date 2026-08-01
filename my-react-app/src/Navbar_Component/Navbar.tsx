import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState ,useEffect} from 'react';

function Navbar(){
    const [logoutState, setlogoutState] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    const handleLogoutConfirm = () => {
        setlogoutState(false);
        navigate('/login');
    };

    return (
        <div className='Navbar-Container'>
            <div>
                <table className='navbar-table'>
                    <tbody>
                        <tr 
                            className={location.pathname === '/dashboard' ? 'active-tab' : ''} 
                            onClick={() => navigate('/dashboard')}
                        >
                            <td>Dashboard</td>
                        </tr>
                        <tr 
                            className={location.pathname === '/StaffList' ? 'active-tab' : ''} 
                            onClick={() => navigate('/StaffList')}
                        >
                            <td>Staff List</td>
                        </tr>
                         <tr className={location.pathname === '/profile' ? 'active-tab' : ''}  onClick={() => navigate('/profile')}>
                            <td>Your Profile</td>
                        </tr>
                          <tr className="theme-row" onClick={() => setIsDarkMode(!isDarkMode)}>
                            <td>{isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</td>
                        </tr>
                        <tr className="logout-row" onClick={() => setlogoutState(true)}>
                            <td>Logout</td>
                        </tr>
                    
                        
                    </tbody>
                </table>
            </div>

            {logoutState && (
                <div className="logoutContainer">
                    <div className="logoutContainer1">
                        <h2 className="logoutContainer2">Logout Confirmation</h2>
                        <p className="logoutContainer3">
                            Are you sure you want to logout from StaffPro?
                        </p>
                        <div className="logoutContainer4">
                            <button
                                onClick={handleLogoutConfirm}
                                className="logoutContainer5"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setlogoutState(false)}
                                className="logoutContainer6"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;