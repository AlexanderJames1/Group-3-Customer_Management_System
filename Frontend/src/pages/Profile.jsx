import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const tierOptions = [
  { minPoints: 50000, reward: "🏆 Black Tier – One-time use: Free item up to ₱25,000, or ₱20,000 off items ₱100,000+, or 70% off any item"
  },
  { minPoints: 20000, reward: "👑 Elite Tier – Free item up to ₱20,000, or ₱15,000 off items ₱100,000+, or 50% off any item"
  },
  { minPoints: 10000, reward: "💎 Platinum Tier – Free item up to ₱15,000, or 40% off any item"
  },
  { minPoints: 5000, reward: "🔷 Gold Tier – 30% off any item"
  },
  { minPoints: 2000, reward: "🔥 Silver Tier – 20% off any item"
  },
  { minPoints: 500, reward: "⭐ Basic Tier – 10% off any item"}
];  


const Profile = ({user, setUser}) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [blackTierUsed, setBlackTierUsed] = useState(false); 

  useEffect(() => {
    fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/place_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        check_black_tier: true,
        customer_id: user.customer_id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === false && data.message.includes("already used")) {
          setBlackTierUsed(true);
        } else {
          setBlackTierUsed(false);
        }
      })
      .catch(err => console.error("Error checking voucher status:", err));
  }, [user.customer_id]);

  useEffect(() => {
    fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/place_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: user.customer_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data);
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user)); // Update localStorage too
        } else {
          console.error("Failed to fetch updated user data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [user.customer_id]);

  if (!user) return <p>Error: User data not found.</p>;

  const handleEditProfile = () => {
  if (!user || !user.customer_id) {
    console.error("Customer ID is not available yet.");
    setError("User data is still loading. Please wait a moment and try again.");
    return;
  }
    if (
      user?.customer_name &&
      user?.email &&
      user?.phone &&
      user?.address &&
      user?.profile_image
    ) {
      setTimeout(() => {
        navigate(`/edit-profile/${user.customer_id}`);
      }, 300);
    } else {
      console.error('Invalid user data:', user);
      setError('User data is incomplete or invalid.');
    }
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Do you really want to logout?");
    if (confirmLogout) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/Sign-in');
  };

  const handleVoucherChange = (e) => {
    const reward = e.target.value;
    setSelectedVoucher(reward);
    const updatedUser = { ...user, selectedVoucher: reward };
    console.log("Updated User:", updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const eligibleVouchers = tierOptions.filter(t => user.loyalty_points >= t.minPoints);

  return (
  <div className="relative min-h-screen bg-white flex items-center justify-center p-6">
    {/* Logout Button */}
    <button
      onClick={handleLogoutClick}
      className="cursor-pointer absolute top-5 right-5 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
    >
      Logout
    </button>

    <div className="max-w-md w-full bg-gray-50 rounded-xl shadow-md p-6 space-y-5 border border-gray-200">
      {/* Loyalty Points */}
      <span className="inline-block bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded shadow-sm">
        ⭐ Loyalty Points: {user.loyalty_points}
      </span>

      {/* Voucher Reward Message */}
      <p className="bg-green-50 text-green-700 px-4 py-2 rounded shadow-sm font-semibold text-center truncate">
        {selectedVoucher || (eligibleVouchers.length ? eligibleVouchers[0].reward : "Earn more points to unlock exclusive rewards!")}
      </p>

      {/* Voucher Selector */}
      {eligibleVouchers.length > 0 && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">Select Loyalty Reward:</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={selectedVoucher}
            onChange={handleVoucherChange}
          >
            <option value="" disabled>-- Choose a Reward --</option>
            {eligibleVouchers.map((tier, index) => {
              const isBlack = tier.reward.includes("Black Tier");
              return (
                <option key={index} value={tier.reward} disabled={isBlack && blackTierUsed}>
                  {tier.reward}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Profile Title */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Your Profile
      </h1>

      {/* Profile Image */}
      <div className="flex justify-center mb-5">
        <img
          src={`http://localhost/CustomersManagementSystem/Backend/uploads/${user.profile_image || 'uni.jpg'}`}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-center font-medium mb-3">{error}</p>
      )}

      {/* User Info */}
      <div className="space-y-2 text-gray-700 text-base">
        <p><span className="font-semibold">Name:</span> {user.customer_name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Phone:</span> {user.phone}</p>
        <p><span className="font-semibold">Address:</span> {user.address}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
        >
          Go back
        </button>
        <button
          onClick={handleEditProfile}
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>

      {/* Optional Message */}
      {message && (
        <p className="text-sm text-center mt-4 text-red-600 font-semibold truncate">{message}</p>
      )}
    </div>
  </div>
);

};

export default Profile;
