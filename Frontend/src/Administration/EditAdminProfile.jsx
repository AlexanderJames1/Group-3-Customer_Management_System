import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditAdminProfile = () => {
  const [admin, setAdmin] = useState({
    admin_name: '',
    email: '',
    phone: '',
    profile_image: '',
  });

  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    if (storedAdmin) {
      setAdmin(storedAdmin);
    } else {
      setError('Admin data not found.');
    }
  }, []);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get admin object from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    const token = storedAdmin?.token; // safely get token

    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('admin_id', admin.admin_id);
    formData.append('admin_name', admin.admin_name);
    formData.append('email', admin.email);
    formData.append('phone', admin.phone);

    if (newImage) {
        formData.append('profile_image', newImage);
    }

    try {
        const res = await axios.post(
        'http://localhost/CustomersManagementSystem/Backend/Administrator/updateAdminProfile.php',
        formData,
        {
            headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data',
            }
        }
        );

        if (res.data.type === 'success') {
        const oldAdmin = JSON.parse(localStorage.getItem('admin'));
        
        // Merge the updated admin info with the old token
        const updatedAdmin = {
            ...res.data.admin,  
            token: oldAdmin?.token || '', 
        };

        // Save back to localStorage with token intact
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        
        alert('Profile updated successfully');
        navigate('/AdminProfile');
        } else {
        setError(res.data.message);
        }
    } catch (err) {
        console.error('Update failed:', err);
        setError('Failed to update profile.');
    }
    };

  return (
    <div className="relative max-w-xl mx-auto bg-white border border-gray-300 shadow-md rounded-2xl p-8 mt-16">

      {/* Go Back Button - Now properly placed above the card */}
      <div className="absolute -top-12 left-0">
        <button
          onClick={() => navigate('/AdminProfile')}
          className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-sm font-semibold"
        >
          ← Go Back
        </button>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="admin_name"
            value={admin.admin_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={admin.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAdminProfile;
