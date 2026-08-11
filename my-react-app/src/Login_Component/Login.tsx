import './Login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/StaffPro image.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    const navigateDashBoard = useNavigate();
    const [SendPassword, setSendPassword] = useState("");
    const [Email, setEmail] = useState("");
    const [PasswordVisibility, setPasswordVisiblity] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

          if (isSubmitting) return; 
    setIsSubmitting(true);
 toast.dismiss();
        fetch('https://staffpro.onrender.com/Api/Staff/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: Email,
                Password: SendPassword,
            })
        })
        .then(async response => {
            const data = await response.json();
            const message = data.Message || "";
        localStorage.setItem("token", data.token);
            const lowerText = message.toLowerCase();
             toast.dismiss();
            if (lowerText.includes("exist") || lowerText.includes("deleted") || lowerText.includes("invalid")) {
                toast.error(message, { autoClose: 4000  });
            } 
        
               else if (lowerText.includes("success")) {
           
                 
                localStorage.setItem("staffName", data.StaffName);
                localStorage.setItem("department", data.Department);
                localStorage.setItem("staffid", data.StaffID);
                
                navigateDashBoard('/dashboard');
                toast.success(`Welcome back, ${data.StaffName}`, { 
                    autoClose: 3000
                });
            }

        })
        .catch(()=> {
            toast.dismiss();
            toast.error("Something went wrong!", { autoClose: 4000 });
            
        }) .finally(() => {
        setIsSubmitting(false);
    });
        
    };

    return (
        <>
        <div className="loginContainer">
            <div className='imageContainer'>
                <img src={logo} alt="StaffPro Logo" />
            </div>
            
            <div className='formContainer'>
                <h3>Welcome</h3>
                <h5>Sign in to access your account.</h5>
                
                <form onSubmit={handleLogin}>
                    <div className='email'>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your Email address" 
                            value={Email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            autoComplete="email"
                            required 
                        />
                    </div>
                    
                    <div className='password'>
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input 
                                type={PasswordVisibility ? 'password' : 'text'}  
                                placeholder="Enter your Password" 
                                value={SendPassword} 
                                onChange={(e) => setSendPassword(e.target.value)} 
                                autoComplete="current-password"
                                required
                            />
                            <span onClick={() => setPasswordVisiblity(!PasswordVisibility)}>
                                {PasswordVisibility ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    
                    <div className='login_button'> 
                        <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Logging in..." : "Log in"}
</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default LoginPage;