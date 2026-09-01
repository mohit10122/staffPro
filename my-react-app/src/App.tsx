import LoginPage from "./Login_Component/Login";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
// import CreateAccountPage from "./Create_Account/New_Account";
import { BrowserRouter , Navigate, Route , Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Dashboard from "./Dashboard/Dashboard";
import StaffList from "./StaffList/StaffList";
import AddStaff from "./AddStaff/AddStaff";
import Profile from "./Profile/Profile";
import Resume from "./Resume_detection/Resume";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App(){
return(
  <>
  <ToastContainer position="top-right" />
<div>
    <BrowserRouter>
    <Routes>
        <Route  element={<Layout />}>
        <Route index element={<Navigate to = "login" replace/>} />
        <Route  path="login" element={<LoginPage />} />
{/* <Route path="CreateUser" element={<CreateAccountPage />} /> */}

        <Route  path="dashboard" element={<Dashboard />} />
        <Route  path="StaffList" element={<StaffList />} />
        <Route  path="profile" element={<Profile />} />
        <Route  path="addStaff" element={<AddStaff />} />
        <Route  path="updateStaff" element={<AddStaff />} />
        <Route  path="apply" element={<Resume />} />
      </Route>
    </Routes>
    </BrowserRouter>
<Toaster />
</div>
</>
)
}
export default App;