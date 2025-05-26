import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    model: '',
    descriptions: '',
    price: '',
    stock_quantity: '',
    image: null,
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append('action', 'insert');
    form.append('category', formData.category);
    form.append('brand', formData.brand);
    form.append('model', formData.model);
    form.append('descriptions', formData.descriptions);
    form.append('price', formData.price);
    form.append('stock_quantity', formData.stock_quantity);
    form.append('image', formData.image);
  
    try {
      const response = await axios.post(
        'http://localhost/CustomersManagementSystem/Backend/Administrator/crud_product.php',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      const result = response.data;
  
      if (result.type === 'success') {
        navigate('/admin');
      } else {
        console.log("Full response:", result);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };  
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-700 hover:text-900 font-medium text-sm px-3 py-1 hover:border-gray-400 transition cursor-pointer select-none"
      >
        ← Go Back
      </button>
      <h2 className="text-2xl font-bold mb-6">Insert A Car Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST" className="space-y-4">
        <div>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a Category</option>
          <option value="Car">Car</option>
          <option value="Apparel">Apparel</option>
          <option value="Gears">Gears</option>
          <option value="Fuel & Fluids">Fuel & Fluids</option> 
          <option value="Engine Parts">Engine Parts</option>     
          <option value="Accessories">Accessories</option>
        </select>
        </div>
        
        <div>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter a Brand Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Enter a Model Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="text"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            placeholder="Enter a Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter a Price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            placeholder="Enter a Stock Quantity"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="submit"
            value="Add Product"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          />
        </div>
      </form>
    </div>
  );  
}

export default AddProduct;
