import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CustomerSegmentation = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const location = useLocation();
  const navigate = useNavigate();

  const filteredSegments = filter === "all" 
  ? segments 
  : segments.filter(s => s.segment.toLowerCase() === filter);

  useEffect(() => {
    fetch("http://localhost/CustomersManagementSystem/Backend/Administrator/get_segments.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSegments(data.data);
        } else {
          alert("Failed to load segments");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching segments");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading customer segments...</p>;

  return (
    <div className="mt-10 max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">

    {/* Filter Buttons */}
    <div className="mb-6 flex gap-4">
      {["all", "vip", "loyal", "big spender", "occasional", "newbie"].map((seg) => (
        <button
          key={seg}
          onClick={() => setFilter(seg)}
          className={`px-4 py-2 rounded font-semibold ${
            filter === seg
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {seg.charAt(0).toUpperCase() + seg.slice(1)}
        </button>
      ))}
    </div>


      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="px-5 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-sm font-semibold"
        >
          ← Go Back
        </button>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide drop-shadow-md">
          Customer Segmentation
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-lg">
          <thead className="bg-gray-200 text-gray-900 uppercase text-left tracking-wide text-xl font-semibold">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Customer ID</th>
              <th className="px-6 py-4">Total Orders</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Segment</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
          {filteredSegments.map(({ profile_image, full_name, customer_id, total_orders, total_spent, segment }) => {
              // Set colors for segment badges based on values
              let segmentColor = 'bg-yellow-300 text-yellow-800'; // default
              if (segment.toLowerCase() === 'vip') {
                segmentColor = 'bg-purple-300 text-purple-900';
              } else if (segment.toLowerCase() === 'newbie') {
                segmentColor = 'bg-gray-300 text-gray-900';
              } else if (segment.toLowerCase() === 'occasional') {
                segmentColor = 'bg-blue-300 text-blue-900';
              } else if (segment.toLowerCase() === 'big spender') {
                segmentColor = 'bg-orange-300 text-orange-900';
              }

              return (
                <tr key={customer_id} className="border-t border-gray-300 hover:bg-gray-100 transition">
                  <td className="px-6 py-5 flex items-center gap-5 font-semibold">
                    <img
                      src={`http://localhost/CustomersManagementSystem/Backend/uploads/${profile_image || 'uni.jpg'}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                    <span className="text-2xl">{full_name}</span>
                  </td>
                  <td className="px-6 py-5 font-medium text-lg">{customer_id}</td>
                  <td className="px-6 py-5 font-medium text-lg">{total_orders}</td>
                  <td className="px-6 py-5 font-semibold text-lg text-orange-600">₱{total_spent.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${segmentColor}`}
                    >
                      {segment}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerSegmentation;
