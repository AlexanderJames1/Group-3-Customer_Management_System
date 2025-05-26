import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Admin = ({admin, setAdmin}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    const token = storedAdmin?.token;
  
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }

    if (token) {
      fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/getAdminProfile.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.type === 'success') {
            setAdmin(data.admin);
          } else {
            setAdmin(null);
          }
        })
        .catch((err) => console.error('Error fetching admin data:', err));
    }

    axios
      .get('http://localhost/CustomersManagementSystem/Backend/Administrator/index.php')
      .then((res) => setCars(res.data))
      .catch((err) => console.error('Failed to fetch cars:', err));
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('product_id', id);
  
      try {
        const res = await axios.post(
          'http://localhost/CustomersManagementSystem/Backend/Administrator/crud_product.php',
          formData
        );
        const data = res.data;
        alert(data.message);
        if (data.type === 'success') {
          setCars((prevCars) => prevCars.filter(car => car.product_id !== id));
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };  

  const goToProfile = () => {
    navigate('/AdminProfile', { state: { admin } });
  };  

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/segments')}
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            Customers Data
          </button>
          <Link
            to="/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            + Add Product
          </Link>
        </div>

        {/* Admin Profile Card */}
        {admin && (
        <div
          onClick={goToProfile}
          className="flex items-center gap-4 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 shadow-lg rounded-xl px-5 py-3 cursor-pointer hover:shadow-xl transition"
        >
          <img
            src={
              admin.profile_image
                ? `http://localhost/CustomersManagementSystem/Backend/uploads/${admin.profile_image}`
                : 'uni.jpg'
            }
            alt="Admin Profile"
            className="transition-transform transform hover:scale-102 w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <div>
            <p className="text-blue-900 font-semibold text-sm">{admin.admin_name}</p>
            <p className="text-xs text-blue-600">Admin Profile</p>
          </div>
        </div>
      )}
      </div>

      {/* Inventory Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Car Products</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Model</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {cars.map((car) => (
                <tr key={car.product_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{car.product_id}</td>
                  <td className="px-4 py-3">{car.category}</td>
                  <td className="px-4 py-3">{car.brand}</td>
                  <td className="px-4 py-3">{car.model}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{car.descriptions}</td>
                  <td className="px-4 py-3">₱{car.price}</td>
                  <td className="px-4 py-3">{car.stock_quantity}</td>
                  <td className="px-4 py-3">
                    <img
                      src={`http://localhost/CustomersManagementSystem/Backend/uploads/${car.image}`}
                      alt="Car"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <Link to={`/update-product/${car.product_id}`}>
                      <button className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(car.product_id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};

export default Admin;
