import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProfile = ({ admin, setAdmin }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const adminData = JSON.parse(localStorage.getItem('admin'));
        const token = adminData?.token;
        if (!token) {
          setError('Authorization token is missing');
          return;
        }

        const response = await axios.get('http://localhost/CustomersManagementSystem/Backend/Administrator/getAdminProfile.php', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.type === 'success') {
          setAdmin(response.data.admin);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch admin profile');
        console.error(err);
      }
    };

    fetchAdminProfile();
  }, []);

  if (error) {
    return <div className="text-red-600 font-bold text-center mt-4">{error}</div>;
  }

  if (!admin) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const goToEdit = () => {
    navigate('/edit_admin', { state: { admin } });
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Do you really want to logout?");
    if (confirmLogout) {
      handleLogout();
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('admin');
  setAdmin(null);  // This ensures the App-level admin state is updated
  navigate('/AdminSignIn');
};

  return (
  <div className="max-w-3xl mx-auto mt-16 px-6 border border-gray-300 rounded-2xl shadow-sm bg-white">

    {/* Top Navigation Buttons */}
    <div className="flex justify-between items-center mb-8 pt-6 px-2">
      <button
        onClick={() => navigate('/admin')}
        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-sm font-medium"
      >
        ← Go Back
      </button>
      <button
        onClick={handleLogoutClick}
        className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>

    {/* Admin Info */}
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 border-b border-gray-200 pb-6 px-2">
      <img
        src={`http://localhost/CustomersManagementSystem/Backend/uploads/${admin.profile_image}`}
        alt="Admin Profile"
        className="w-36 h-36 rounded-full object-cover ring-4 ring-indigo-300"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-gray-800">{admin.admin_name}</h1>
        <p className="text-gray-600 mt-2 text-lg">📧 {admin.email}</p>
        <p className="text-gray-600 text-lg">📞 {admin.phone}</p>
      </div>
    </div>

    {/* Edit Button */}
    <div className="text-center sm:text-right p-6">
      <button
        onClick={goToEdit}
        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        ✏️ Edit Profile
      </button>
    </div>

  </div>
);

};

export default AdminProfile;
