import './new_account.css'
import { useNavigate } from 'react-router-dom';
// import Logo from '../Logo/Logo';

function CreateAccountPage() {
    const navigate = useNavigate();
  return (
    
    <div className="newUser">
      {/* <Logo /> */}
      <h3>Create Account</h3>
      <h5>Fill your details to get started</h5>

      <div className='name'>
        <label>Full Name</label>
        <input type="text" placeholder="Enter your name" />
      </div>

         <div className='DOB'>
        <label>Date of Birth</label>
        <input type="date" placeholder="Enter your Date of Birth" />
      </div>

      <div className='email'>
        <label>Email Address</label>
        <input type="text" placeholder="Enter your email" />
      </div>

      <div className='password'>
        <label>Password</label>
        <input type="password" placeholder="Create a password" />
      </div>
         <div className='confirm_password'>
        <label>Confirm Password</label>
        <input type="password" placeholder="Re-Enter password" />
      
      </div>
      <div className='signup_button'>
        <button>Sign Up</button>
      </div>
       <div className='new_account'>
        <button onClick={()=>navigate('/login')}>Already have an account? Log in</button>
      </div>
    </div>
  )
}

export default CreateAccountPage;