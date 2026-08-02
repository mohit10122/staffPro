import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './AddStaff.css';
import { useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddStaff() {
  const location = useLocation();
  const { isupdateStaff, matchedStaff } = location.state || {};

  const [PasswordVisibility, setPasswordVisiblity] = useState(true);
  

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
    if (isupdateStaff && StaffId) {
      fetch('https://staffpro.onrender.com/Api/Staff/bindPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ StaffID: StaffId, Flag: "getPassword" })
      })
      .then(async response => {
        const text = await response.text();
      
        setPassword(text); 
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Something went wrong!", { autoClose: 4000 });
      });
    }
  }, [isupdateStaff, StaffId]);

  const isFormValid = StaffName && Phoneno && Email && Department && Salary && Joining_Date && Password;

 
  const handleSubmitForm = (e: React.FormEvent) => {
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
      headers: { 'Content-Type': 'application/json' },
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
                <option value="Admin">Admin</option>
                <option value="Backend Developer">Java Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="QA / Testing">QA / Testing</option>
                <option value="HR">HR</option>
                <option value="Project Manager / TL">Project Manager / TL</option>
                <option value="Finance">Finance</option>
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
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={PasswordVisibility ? 'password' : 'text'} 
                  className="form-input"  
                  placeholder="enter your password" 
                  value={Password} 
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength={4} 
                  required 
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