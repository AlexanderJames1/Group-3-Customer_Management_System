import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [customer, setCustomer] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    profile_image: null,
  });

    useEffect(() => {
    fetch(`http://localhost/CustomersManagementSystem/Backend/Administrator/Customers.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.customer_id == id) {
          setCustomer(data);
        } else {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser && storedUser.customer_id == id) {
            setCustomer(storedUser);
          }
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Pag validate
    if (!customer.customer_name || !customer.email || !customer.phone || !customer.address) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('customer_id', id);
    formData.append('customer_name', customer.customer_name);
    formData.append('email', customer.email);
    formData.append('phone', customer.phone);
    formData.append('address', customer.address);

    // Append image if provided
    if (customer.profile_image && customer.profile_image instanceof File) {
      formData.append('profile_image', customer.profile_image);
    }

    try {
      const res = await axios.post(
        'http://localhost/CustomersManagementSystem/Backend/Administrator/updateUserProfile.php',
        formData
      );

      const data = res.data;
      alert(data.message);

      if (data.type === 'success') {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.customer_id == id) {
            const updatedUser = {
                ...currentUser,
                customer_name: customer.customer_name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                profile_image: customer.profile_image instanceof File
                    ? data.profile_image  
                    : currentUser.profile_image
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    
        navigate('/profile');
    }          
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

 return (
  <div className="max-w-md mx-auto mt-10 px-4 relative">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="absolute -top-4 left-0 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium shadow-sm"
    >
      ← Go Back
    </button>

    <form
      onSubmit={handleUpdate}
      className="p-6 bg-white rounded-lg border border-gray-300 shadow-sm space-y-4"
    >
      <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Edit Profile</h2>

      <input
        type="text"
        placeholder="Name"
        value={customer.customer_name}
        onChange={e => setCustomer({ ...customer, customer_name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />

      <input
        type="email"
        placeholder="Email"
        value={customer.email}
        onChange={e => setCustomer({ ...customer, email: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />

      <input
        type="text"
        placeholder="Phone"
        value={customer.phone}
        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />

      <input
        type="text"
        placeholder="Address"
        value={customer.address}
        onChange={e => setCustomer({ ...customer, address: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />

      <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Upload Profile Image
        </label>
        <input
          type="file"
          onChange={e => setCustomer({ ...customer, profile_image: e.target.files[0] })}
          name="profile_image"
          id="profile_image"
          className="text-sm text-gray-700"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition text-sm font-medium"
      >
        Update
      </button>
    </form>
  </div>
);


};

export default Update;
