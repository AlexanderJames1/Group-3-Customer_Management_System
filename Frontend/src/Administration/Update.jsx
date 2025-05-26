import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Update = () => {
  const { id } = useParams();
  console.log("Customer ID from URL:", id);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    category: '',
    brand: '',
    model: '',
    descriptions: '',
    price: '',
    stock_quantity: '',
    image: null,
  });

  useEffect(() => {
    fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/index.php')
      .then(res => res.json())
      .then(data => {
        const item = data.find(car => car.product_id == id);
        if (item) {
          setProduct(item);
        } else {
          console.warn('Product not found!');
        }
      })
      .catch(err => console.error('Failed to fetch product:', err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!product.category || !product.brand || !product.model || !product.price || !product.stock_quantity) {
      alert('Please fill in all required fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('product_id', id);   
    formData.append('category', product.category);
    formData.append('brand', product.brand);
    formData.append('model', product.model);
    formData.append('descriptions', product.descriptions);
    formData.append('price', product.price);
    formData.append('stock_quantity', product.stock_quantity);
  
    if (product.image && product.image instanceof File) {
      formData.append('image', product.image);
    }
  
    try {
      const res = await axios.post(
        'http://localhost/CustomersManagementSystem/Backend/Administrator/crud_product.php',
        formData
      );
  
      const data = res.data;
      alert(data.message);
  
      if (data.type === 'success') {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };  

  return (
  <div className="mt-10 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-900">Update Product</h2>
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <select
          name="category"
          value={product.category}
          onChange={e => setProduct({ ...product, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        >
          <option value="" disabled>
            Select a Category
          </option>
          <option value="Car">Car</option>
          <option value="Apparel">Apparel</option>
          <option value="Gears">Gears</option>
          <option value="Fuel & Fluids">Fuels</option>
          <option value="Engine Parts">Engine_Parts</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="Brand"
          value={product.brand}
          onChange={e => setProduct({ ...product, brand: e.target.value })}
          name="brand"
          id="brand"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Model"
          value={product.model}
          onChange={e => setProduct({ ...product, model: e.target.value })}
          name="model"
          id="model"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Description"
          value={product.descriptions}
          onChange={e => setProduct({ ...product, descriptions: e.target.value })}
          name="descriptions"
          id="descriptions"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={e => setProduct({ ...product, price: e.target.value })}
          name="price"
          id="price"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Stock Quantity"
          value={product.stock_quantity}
          onChange={e => setProduct({ ...product, stock_quantity: e.target.value })}
          name="stock_quantity"
          id="stock_quantity"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <input
          type="file"
          onChange={e => setProduct({ ...product, image: e.target.files[0] })}
          name="image"
          id="image"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
        >
          Update
        </button>
      </div>
    </form>
  </div>
);

  
};

export default Update;
