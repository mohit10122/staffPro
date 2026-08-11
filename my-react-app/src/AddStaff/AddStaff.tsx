import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './AddStaff.css';
import { useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddStaff() {
  const location = useLocation();
  const { isupdateStaff, matchedStaff } = location.state || {};

  const [PasswordVisibility, setPasswordVisiblity] = useState(true);
  
 const [AllDepartment,setAllDepartment] = useState<any[] | null>(null);
  const [StaffId, setStaffId] = useState<number | string>(""); 
  const [StaffName, setStaffName] = useState("");
  const [Phoneno, setPhoneno] = useState<string | null>("");
  const [Email, setEmail] = useState("");
  const [Department, setDepartment] = useState("");
  const [Salary, setSalary] = useState<number | ''>('');
  const [Joining_Date, setJoining_Date] = useState<string>('');
  const [Password, setPassword] = useState("");
  const [PermanentAddress, setPermanentAddress] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isupdateStaff && matchedStaff) {
      setStaffId(matchedStaff.StaffID || "");
      setStaffName(matchedStaff.StaffName || "");
      setPhoneno(matchedStaff.Phoneno || "");
      setEmail(matchedStaff.Email || "");
      setDepartment(matchedStaff.Department || "");
      setSalary(matchedStaff.Salary || '');
      setJoining_Date(matchedStaff.Joining_Date ? matchedStaff.Joining_Date.split('T')[0] : '');
      setPassword(""); 
      setPermanentAddress(matchedStaff.Permanent_address || "");
    }
  }, [isupdateStaff, matchedStaff]);

  useEffect(() => {
   
    
      fetch('https://staffpro.onrender.com/Api/Staff/getDepartment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  Flag: "get_Departments" })
      })
    .then(response => response.json())
    .then(data => {
     
      setAllDepartment(data);
   
    })
 
    }, []);
  

  const isSaveFormValid = Boolean(StaffName && Phoneno && Email && Department && Salary && Joining_Date && Password);
const isUpdateFormValid = Boolean(StaffName && Phoneno && Email && Department && Salary && Joining_Date);
 const isFormValid = isupdateStaff ? isUpdateFormValid : isSaveFormValid;
  const handleSubmitForm = (e: React.FormEvent) => {
    const token = localStorage.getItem("token");
    e.preventDefault(); 
    if (isSubmitting) return;
    setIsSubmitting(true);
    toast.dismiss();
    const endpoint = isupdateStaff 
      ? 'https://staffpro.onrender.com/Api/Staff/update' 
      : 'https://staffpro.onrender.com/Api/Staff/save';
      
    const method = isupdateStaff ? 'PUT' : 'POST';
    const flagValue = isupdateStaff ? "UpdateStaff" : "saveStaffDetail";

    const payload = {
      ...(isupdateStaff && { StaffID: StaffId }),
      Flag: flagValue,
      StaffName: StaffName,
      Phoneno: Phoneno,
      Email: Email,
      Department: Department,
      Salary: Salary,
      Joining_Date: Joining_Date,
      Password: Password,
      Active: 'y',
      Permanent_address: PermanentAddress
    };

    fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' ,'Authorization': 'Bearer ' + token},
      body: JSON.stringify(payload)
    })
    .then(async response => {
      const text = await response.text();
      toast.dismiss();
      if (text.toLowerCase().includes("exist") || text.toLowerCase().includes("already") ) {
        toast.error(text, { autoClose: 4000 });
      } else {
        toast.success(text, { autoClose: 4000 });
        
      
          setStaffName("");
          setPhoneno("");
          setEmail("");
          setDepartment("");
          setSalary("");
          setJoining_Date("");
          setPassword("");
          setPermanentAddress("");
        
      }
    })
    .catch(() => {
      toast.dismiss();
      toast.error("Something went wrong!", { autoClose: 4000 });
    })   .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="add-Staff-container">
      <div className="form-card">
        <form onSubmit={handleSubmitForm}>
          <div className="form-grid">
            
            {/* Staff ID field */}
            <div className="form-group">
              <label>Staff ID</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Auto-generated" 
                value={StaffId} 
                disabled 
              />
            </div>
            
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Rajesh Singh Thakur" 
                value={StaffName}  
                onChange={(e) => {
                  let val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  val = val.replace(/\b\w/g, (char) => char.toUpperCase());
                  setStaffName(val);
                }}
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="e.g. 9876543210" 
                value={Phoneno || ""} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneno(val);
                }}
                pattern="[0-9]{10}" 
                maxLength={10} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. email@gmail.com" 
                value={Email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select 
                className="form-input"  
                value={Department} 
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Please choose a department</option>
                {AllDepartment && AllDepartment.map((dept, index) => (
      <option key={index} >
        {dept.Department}
      </option>
    ))}
             
              </select>
            </div>

            <div className="form-group">
              <label>Permanent Address</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. House no.-5, Surya colony, Dehradun" 
                value={PermanentAddress} 
                onChange={(e) => {
                  let val = e.target.value;
                  val = val.replace(/(^\w|\s\w)/g, (char) => char.toUpperCase());
                  setPermanentAddress(val);
                }}
                required 
             />
            </div>

            <div className="form-group">
              <label>Salary (₹)</label>
             <input 
    type="number" 
    step="any" 
    className="form-input" 
    placeholder="e.g. 45000.50"  
    value={Salary}
    onChange={(e) => {
      const val = e.target.value;
      setSalary(val === '' ? '' : Number(val));
    }}
    required 
  />
            </div>

            <div className="form-group">
              <label>Joining Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={Joining_Date} 
                onChange={(e) => setJoining_Date(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password {isupdateStaff && "(Optional - Leave empty to keep existing password)"}</label>
              <div className="password-input-wrapper">
                <input 
                  type={PasswordVisibility ? 'password' : 'text'} 
                  className="form-input"  
                  placeholder={isupdateStaff ? "Leave blank to keep old password" : "enter your password"}
                  value={Password} 
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength={!isupdateStaff || Password.length > 0 ? 4 : undefined}
                  required={!isupdateStaff}
                />
                <span className="password-toggle-icon" onClick={() => setPasswordVisiblity(!PasswordVisibility)}>
                  {PasswordVisibility ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
<div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit" 
                disabled={!isFormValid || isSubmitting}
  style={{
    opacity: (isFormValid && !isSubmitting) ? 1 : 0.5, 
    cursor: (isFormValid && !isSubmitting) ? 'pointer' : 'not-allowed'
  }}
>
  {isSubmitting 
    ? (isupdateStaff ? "Updating..." : "Saving...") 
    : (isupdateStaff ? "Update Changes" : "Save Staff")}
</button>
          </div>
          </div>

          
        </form>
      </div>
    </div>
  );
}

export default AddStaff;