import React, { useState, useEffect, use } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Onboarding = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // Pag get ng user data

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelected((prev) => [...prev, value]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== value));
    }
  };

  const submitPreferences = () => {
    if (selected.length === 0) {

      alert("Please select at least one category.");
      return;
    }

    const preference = selected.join(", "); 

    axios.post("http://localhost/CustomersManagementSystem/Backend/Administrator/Customers.php", {
        customer_id: user.customer_id,
        preference: preference
    })
    .then(res => {
      alert("Preferences saved: " + selected.join(", "));
      localStorage.setItem(`onboarding_${user.email}`, JSON.stringify({ selectedCategories: selected }));
      navigate('/');
  })
  .catch(err => {
      console.error(err);
      alert("Error saving preferences");
  });
};

  
  return (
  <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-bold mb-4">Select What You're Interested In</h1>

    <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg space-y-4 shadow">
      {[
        "Car",
        "Apparel",
        "Gears",
        "Fuel & Fluids",
        "Engine Parts",
        "Accessories",
      ].map((category) => (
        <label key={category} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={category}
            onChange={handleCheckbox}
            className="accent-blue-500"
          />
          <span>{category}</span>
        </label>
      ))}

      <button
        onClick={submitPreferences}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Continue
      </button>
    </div>
  </div>
);

};

export default Onboarding;
