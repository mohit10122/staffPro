import './StaffList.css';

import { FaSearch, FaPlus, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function StaffsList() {
  const navigateAddStaff = useNavigate();
  

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeavingDateModal, setShowLeavingDateModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<String | null>(null);
  const [deleteDepartment, setDeleteDepartment] = useState<String | null>(null);
  const [leavingDate, setLeavingDate] = useState('');
  const [staffid, setStaffid] = useState(0);
  const [Staffdata, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);


  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [reactivateId, setReactivateId] = useState<number | null>(null);
  const [reactivateName, setReactivateName] = useState<String | null>(null);
  const [reactivateDepartment, setReactivateDepartment] = useState<String | null>(null);
  const [SearchStaff , setSearchStaff]=useState("");
  const department = localStorage.getItem("department");
  const staffId = localStorage.getItem("staffid");
    const formatSalary = (amount: number) => {
      if (amount === null || amount === undefined) return "";
      const formattedNumber = Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    
      return `₹${formattedNumber} `;
   };

  const fetchStaffData = () => {
    fetch('http://localhost:8080/Api/Staff/getDetail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        StaffID: staffId,
        Flag: "getStaffDetail"
      })
    })
    .then(response => response.json())
    .then((data : any[] )=> {
      setData(data );
      setLoading(false);
      const loggedInStaff = data.find(staff => String(staff.StaffID) === String(staffId));
        if (loggedInStaff && loggedInStaff.Department) {
          localStorage.setItem("department", loggedInStaff.Department);
        }
    
 
  })
    .catch(error => {
      console.error("API Error:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStaffData();
  }, []);
const filteredStaff = Staffdata ? Staffdata.filter((staff) => {
    const query = SearchStaff.toLowerCase();
    return (
      staff.StaffName?.toLowerCase().includes(query) ||
      staff.Email?.toLowerCase().includes(query) ||
      staff.Phoneno?.includes(query) ||
      staff.Department?.toLowerCase().includes(query) 
    );
  }) : [];
  const handleDeleteInit = (id: number, name: String, department: String) => {
    setDeleteId(id);
    setDeleteName(name);
    setDeleteDepartment(department);
    setShowDeleteModal(true);
  };

  const proceedToLeavingDate = () => {
    setShowDeleteModal(false);
    setShowLeavingDateModal(true);
  };

  const handleFinalDeleteWithDate = () => {
    if (!deleteId || !leavingDate) {
      alert("Please select a leaving date.");
      return;
    }

    fetch('http://localhost:8080/Api/Staff/deleteStaff', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        StaffID: deleteId,
        Flag: "delete_user", 
        Leaving_date: leavingDate,
        Active: 'n'
      })
    })
    .then(response => response.json())
    .then(data => {
      setShowLeavingDateModal(false);
      setLeavingDate('');
      setDeleteId(null);
      fetchStaffData();
      toast.success(
        <span>
          <b>{data.Department}</b> <b>{data.StaffName}</b> marked as deleted successfully.
        </span>
      );
    })
    .catch(error => {
      console.error("Delete API Error:", error);
      alert("Failed to delete staff.");
    });
  };

  const handleReactivateInit = (id: number, name: String, department: String) => {
    setReactivateId(id);
    setReactivateName(name);
    setReactivateDepartment(department);
    setShowReactivateModal(true);
  };


  const handleFinalReactivate = () => {
    fetch('http://localhost:8080/Api/Staff/deleteStaff', { 
      method: 'Delete', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        StaffID: reactivateId,
        Flag: "delete_user",
        Active: 'y'
      })
    })
    .then(response => response.json())
    .then(data => {
      setShowReactivateModal(false);
      setReactivateId(null);
      fetchStaffData(); 
      toast.success(
        <span>
          <b>{reactivateDepartment}</b> <b>{reactivateName}</b> reactivated successfully.
        </span>
      );
    })
    .catch(error => {
      console.error("Reactivate API Error:", error);
      alert("Failed to reactivate staff.");
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowLeavingDateModal(false);
    setDeleteId(null);
    setLeavingDate('');
    
   
    setShowReactivateModal(false);
    setReactivateId(null);
  };

  if (loading) return <h2>Loading Staff Data...</h2>;

  return (
    <div className="Staffs-container">
   
      <div className="search-section">
        <div className="search-wrapper">
          <input type="text" placeholder="Search Staff..." className="search-input" value={SearchStaff}
    onChange={(e) => setSearchStaff(e.target.value)}/>
          <FaSearch size={16} color="#6b7280" className="search-icon" />
        </div>
        {department === "Admin" && (
          <button className="add-btn" onClick={() => navigateAddStaff('/addStaff', { state: { isupdateStaff: false } })}>
            <FaPlus /> Add Staff
          </button>
        )}
      </div>
        
      {/* Table Section */}
      <div className="table-wrapper">
        <table className='staff-table'>
          <thead>
            <tr>
              <th>Staff ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th> <th>Joining Date</th>
              {department === "Admin" && <th>Salary</th>}<th>Permanent Address</th>
              {department === "Admin" && <th>Last Working Day</th>}
              {department === "Admin" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStaff && filteredStaff.length > 0 ? (
              filteredStaff.map((staff, index) => (
                <tr key={staff.StaffID || index}>
                  <td>{staff.StaffID}</td>
                  <td>{staff.StaffName}</td>
                  <td>{staff.Email}</td>
                  <td>{staff.Phoneno}</td>
                  
                  <td>{staff.Department}</td>
                  
                  <td>{formatDate(staff.Joining_Date)}</td>
                  {department === "Admin" && <td>{formatSalary(staff.Salary)}</td>} 
                  <td>{staff.Permanent_address}</td>
                  {department === "Admin" && <td>{formatDate(staff.Leaving_Date)}</td>} 
                  {department === "Admin"   && (
                    <td>
                      <div className="action-buttons">
                        
                        {/* UPDATE BUTTON */}
                      {staff.Active === 'y' && (
  <button
    className="action-btn edit-btn"
    onClick={() => {
      setStaffid(staff.StaffID);
      const matchedStaff = staff;

      navigateAddStaff('/updateStaff', {
        state: {
          isupdateStaff: true,
          staffId: staff.StaffID,
          matchedStaff: matchedStaff
        }
      });
    }}
  >
    <FaEdit /> Update
  </button>
)}
                        

                        {( staff.Active === 'n') ? (
                           <button className="action-btn reactivate-btn" onClick={() => handleReactivateInit(staff.StaffID, staff.StaffName, staff.Department)} style={{ backgroundColor: '#16a34a', color: 'white', display: 'flex', gap: '5px', alignItems: 'center', margin: 'auto' }}>
                             <FaUndo /> Reactivate
                           </button>
                        ) : (
                           <button className="action-btn delete-btn" onClick={() => handleDeleteInit(staff.StaffID, staff.StaffName, staff.Department)}>
                             <FaTrash /> Delete
                           </button>
                        )}
                        
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} style={{ textAlign: "center" }}>No Data Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Confirmation */}
      {showDeleteModal && (
        <div className="logoutContainer">
          <div className="logoutContainer1">
            <h2 className="logoutContainer2" style={{ color: '#ef4444' }}>Delete Staff</h2>
            <p className="logoutContainer3">
              Are you sure you want to delete <b>{deleteDepartment}</b> <b>{deleteName}</b> ? This action cannot be undone.
            </p>
            <div className="logoutContainer4">
              <button onClick={proceedToLeavingDate} className="logoutContainer5">
                Yes, Delete
              </button> 
              <button onClick={closeAllModals} className="logoutContainer6">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Leaving Date Picker */}
      {showLeavingDateModal && (
        <div className="logoutContainer">
          <div className="logoutContainer1">
            <h2 className="logoutContainer2" style={{ color: '#d97706' }}>Enter Leaving Date</h2>
            <p className="logoutContainer3" style={{ marginBottom: '15px' }}>
              Please provide the leaving date for <b>{deleteDepartment}</b><b> {deleteName}</b><b> Staff ID: **{deleteId}**</b>
            </p>
            
            <input 
              type="date" 
              value={leavingDate}
              onChange={(e) => setLeavingDate(e.target.value)}
              className="swal2-input"
              style={{ width: '90%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
            />

            <div className="logoutContainer4">
              <button onClick={handleFinalDeleteWithDate} className="logoutContainer5" style={{ backgroundColor: '#2563eb' }}>
                Submit & Delete
              </button> 
              <button onClick={closeAllModals} className="logoutContainer6">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [NEW CHANGE]: MODAL 3: Reactivate Confirmation Modal */}
      {showReactivateModal && (
        <div className="logoutContainer">
          <div className="logoutContainer1">
            <h2 className="logoutContainer2" style={{ color: '#16a34a' }}>Reactivate Staff</h2>
            <p className="logoutContainer3">
              Are you sure you want to reactivate <b>{reactivateDepartment}</b> <b>{reactivateName}</b> ?
            </p>
            <div className="logoutContainer4">
              <button onClick={handleFinalReactivate} className="logoutContainer5" style={{ backgroundColor: '#16a34a' }}>
                Yes, Reactivate
              </button> 
              <button onClick={closeAllModals} className="logoutContainer6">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StaffsList;