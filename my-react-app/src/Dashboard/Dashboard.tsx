import './Dashboard.css';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [Staffdata, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const staffId = localStorage.getItem("staffid");

  const fetchStaffData = () => {
    fetch('https://staffpro.onrender.com/Api/Staff/getDetail', {
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
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(error => {
      console.error("API Error:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const activeStaffList = Staffdata ? Staffdata.filter(staff => staff.Active !== 'n') : [];

  const totalStaffCount = activeStaffList.length;

  // const uniqueDepartmentsCount = new Set(activeStaffList.map(staff => staff.Department)).size;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); 

  const oneYearJoinersList = activeStaffList.filter(staff => {
    if (!staff.Joining_Date) return false;
    const joiningDate = new Date(staff.Joining_Date);
    return joiningDate >= oneYearAgo;
  });

  const newJoinersCount = oneYearJoinersList.length;

  const recentStaffs = [...oneYearJoinersList].sort(
    (a, b) => Number(b.StaffID) - Number(a.StaffID)
  );

  if (loading) return <h2>Loading Dashboard...</h2>;

  return (
    <div className="dashboardContainer">
      <div className="stats-grid">
        <div className="TotalStaffs stat-card">
          <h5>Total Staff</h5>
          <p>{totalStaffCount}</p>
        </div>

        <div className="TotalDepartment stat-card">
          <h5>Departments</h5>
          <p>8</p>
        </div>

        <div className="NewJoiners stat-card">
          <h5>New Joiners (1 Year)</h5>
          <p>{newJoinersCount}</p>
        </div>
      </div>

      <div className="table-container">
        <h3>Recent Staffs</h3>
        <table className='staff-table'>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Permanent Address</th>
            </tr>
          </thead>
          <tbody>
            {recentStaffs && recentStaffs.length > 0 ? (
              recentStaffs.map((staff, index) => (
                <tr key={staff.StaffID || index}>
                  <td>{staff.StaffID}</td>
                  <td>{staff.StaffName}</td>
                  <td>{staff.Email}</td>
                  <td>{staff.Department}</td>
                  <td>{formatDate(staff.Joining_Date)}</td>
                  <td>{staff.Permanent_address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;