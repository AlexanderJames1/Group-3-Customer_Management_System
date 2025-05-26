import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  if (!car) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        No car selected.
        <button onClick={() => navigate(-1)} className="ml-2 text-blue-600 underline">Go back</button>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate(`/checkout/${car.product_id}`, { state: { car } });
  };  

  return (
  <div className="max-w-3xl mx-auto p-4 bg-gray-50 min-h-screen flex flex-col items-center">
    <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-700 hover:text-900 font-medium text-sm px-3 py-1 hover:border-gray-400 transition cursor-pointer select-none"
      >
        ← Go Back
      </button>
    {/* Image container */}
    <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 w-full">
      <img
        src={`http://localhost/CustomersManagementSystem/Backend/uploads/${car.image}`}
        alt={car.model}
        className="w-full h-72 object-contain bg-white transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Details card */}
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 w-full">
      <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
        {car.brand} {car.model}
      </h2>

      <p className="text-xs uppercase tracking-wide text-indigo-600 font-medium">
        {car.category}
      </p>

      <p className="text-gray-700 text-sm leading-relaxed">{car.descriptions}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xl font-bold text-orange-600">
          ₱{car.price.toLocaleString()}
        </div>

        <div
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            car.stock_quantity > 5
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {car.stock_quantity > 5 ? "In Stock" : "Limited Stock"}
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-2xl shadow-md hover:scale-100 transition-transform"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
);

};

export default Order;
