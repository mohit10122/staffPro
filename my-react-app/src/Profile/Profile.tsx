import './Profile.css';
import { useEffect, useState } from 'react';
import { FaIdBadge, FaUser, FaBuilding, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';

function Profile() {
   const [profileData, setProfileData] = useState<any>(null);
   const staffId = localStorage.getItem("staffid");

   const fetchStaffData = () => {
      fetch('https://staffpro.onrender.com/Api/Staff/getDetail', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            StaffID: staffId,
            Flag: "getProfileDetail"
         })
      })
      .then(response => response.json())
      .then((data: any) => {
         const actualData = Array.isArray(data) ? data[0] : data;
         setProfileData(actualData);
      })
      .catch(error => {
         console.error("API Error:", error);
      });
   };
 
   useEffect(() => {
      fetchStaffData();
   }, []);

   const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;
      return `${day}-${month}-${year}`;
   };

  
   const numberToWords = (num: number): string => {
      if (num === 0) return "Zero";
      
      const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      const getBelowThousand = (n: number): string => {
         if (n === 0) return '';
         if (n < 20) return a[n];
         if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
         return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + getBelowThousand(n % 100) : '');
      };

      let crore = Math.floor(num / 10000000);
      let lakh = Math.floor((num % 10000000) / 100000);
      let thousand = Math.floor((num % 100000) / 1000);
      let remainder = num % 1000;

      let res = '';
      if (crore > 0) res += getBelowThousand(crore) + ' Crore ';
      if (lakh > 0) res += getBelowThousand(lakh) + ' Lakh ';
      if (thousand > 0) res += getBelowThousand(thousand) + ' Thousand ';
      if (remainder > 0) res += getBelowThousand(remainder);

      return res.trim();
   };

   const formatSalary = (amount: number) => {
      if (amount === null || amount === undefined) return "";
      const formattedNumber = Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
      const words = numberToWords(Math.floor(amount));
      return `₹${formattedNumber} (${words})`;
   };

   if (!profileData) {
      return <h2 style={{ marginLeft: '60px' }}>
    Loading Profile Data
    <span className="loading-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  </h2>;
   }

   return (
      <div className="profile-container">
         <div className="profile-card">
            
            <div className="profile-item">
               <FaIdBadge className="profile-icon" />
               <div>
                  <span className="profile-label">Staff ID</span>
                  <p className="profile-value">{profileData.StaffID}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaUser className="profile-icon" />
               <div>
                  <span className="profile-label">Name</span>
                  <p className="profile-value">{profileData.StaffName}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaBuilding className="profile-icon" />
               <div>
                  <span className="profile-label">Department</span>
                  <p className="profile-value">{profileData.Department}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaEnvelope className="profile-icon" />
               <div>
                  <span className="profile-label">Email</span>
                  <p className="profile-value">{profileData.Email}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaPhoneAlt className="profile-icon" />
               <div>
                  <span className="profile-label">Phone No</span>
                  <p className="profile-value">{profileData.Phoneno}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaCalendarAlt className="profile-icon" />
               <div>
                  <span className="profile-label">Joining Date</span>
                  <p className="profile-value">{formatDate(profileData.Joining_Date)}</p>
               </div>
            </div>

            <div className="profile-item">
               <FaMoneyBillWave className="profile-icon" />
               <div>
                  <span className="profile-label">Salary</span>
                  <p className="profile-value">{formatSalary(profileData.Salary)}</p>
               </div>
            </div>

            <div className="profile-item full-width">
               <FaMapMarkerAlt className="profile-icon" />
               <div>
                  <span className="profile-label">Permanent Address</span>
                  <p className="profile-value">{profileData.Permanent_address}</p>
               </div>
            </div>

         </div>
      </div>
   );
}

export default Profile;