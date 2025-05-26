import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.customer_name || "",
    address: user?.address || "",
    city: "",
    phone: user?.phone || "",
  });
  const [voucher, setVoucher] = useState(user?.selectedVoucher || "");
  const [isVoucherDropdownDisabled, setIsVoucherDropdownDisabled] = useState(true);
  const [blackTierUsed, setBlackTierUsed] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (user) {
      console.log("Loyalty Points:", user.loyalty_points);
      console.log("Selected Voucher:", voucher);

      // Check if the user has enough loyalty points
      if (user.loyalty_points >= 500) {
        setIsVoucherDropdownDisabled(false); // Eneble ang dropdown pag enough ang points
        setAvailableVouchers(getAvailableVouchers(user.loyalty_points)); // Pag set kang available vouchers base sa loyalty points
      }
      
      // Pag check if Blacktier nagamit na
      if (voucher === "Black Tier") {
      const checkVoucherUsage = async () => {
        try {
          const response = await fetch("http://localhost/CustomersManagementSystem/Backend/Administrator/place_order.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_id: user.customer_id,
              check_black_tier: true,
            }),
          });
          const result = await response.json();
          if (result.success === false && result.message === "Black Tier voucher already used.") {
            alert("Black Tier voucher has already been used.");
            setBlackTierUsed(true);
          }
        } catch (error) {
          console.error("Error checking voucher usage:", error);
        }
      };

      checkVoucherUsage();
    }
    }
  }, [user, voucher]);

  useEffect(() => {
    if (location.state?.car) {
      setCar(location.state.car);
    }
  }, [location.state]);

  const getAvailableVouchers = (points) => {
    const vouchers = [];
    if (points >= 50000) vouchers.push("Black Tier");
    if (points >= 20000) vouchers.push("Elite Tier");
    if (points >= 10000) vouchers.push("Platinum Tier");
    if (points >= 5000) vouchers.push("Gold Tier");
    if (points >= 2000) vouchers.push("Silver Tier");
    if (points >= 500) vouchers.push("Basic Tier");
    return vouchers;
  };
  

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
  };

  const getDiscount = () => {
  const points = user?.loyalty_points || 0;
  const selected = voucher;
  const basePrice = car?.price * quantity;
  const isHighValue = basePrice >= 100000;
  const blackTierUsedFlag = blackTierUsed;

  if (!selected || points < 500) {
    return { price: basePrice, reason: "No Loyalty voucher gained." };
  }

  // Default: no discount
  let finalPrice = basePrice;
  let reason = "No valid discount applied.";

  if (selected.includes("Black Tier")) {
     if (blackTierUsedFlag) {
      return { price: basePrice, reason: "Black Tier already used. One-time only." };
    }

    if (selected.includes("Black Tier")) {
      finalPrice = basePrice * 0.3; 
      reason = "Black Tier: 70% off applied";
    }

  } else if (selected.includes("Elite Tier")) {
      finalPrice = basePrice * 0.5;
      reason = "Elite Tier: 50% off applied";

  } else if (selected.includes("Platinum Tier")) {
      finalPrice = basePrice * 0.6;
      reason = "Platinum Tier: 40% off applied";

  } else if (selected.includes("Gold Tier")) {
    finalPrice = basePrice * 0.7;
    reason = "Gold Tier: 30% off applied";

  } else if (selected.includes("Silver Tier")) {
    finalPrice = basePrice * 0.8;
    reason = "Silver Tier: 20% off applied";

  } else if (selected.includes("Basic Tier")) {
    finalPrice = basePrice * 0.9;
    reason = "Basic Tier: 10% off applied";
  }

  return { price: finalPrice, reason };
};

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
  if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
    alert("Please fill out all shipping fields.");
    return;
  }

  if (quantity > car.stock_quantity) {
    alert("Not enough stock available.");
    return;
  }

  const { price: finalAmount } = getDiscount();
  const pointsToDeduct = getPointsToDeduct(voucher); // Points based sa selected na Voucher

  // Make sure na ang customers may enough points to deduct
  if (user.loyalty_points < pointsToDeduct) {
    alert(`You do not have enough loyalty points. You need at least ${pointsToDeduct} points.`);
    return;
  }

  const updatedLoyaltyPoints = user.loyalty_points - pointsToDeduct;

  try {
    const response = await fetch("http://localhost/CustomersManagementSystem/Backend/Administrator/place_order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      customer_id: user?.customer_id,
      car_id: car.product_id,
      brand: car.brand,        
      model: car.model,       
      quantity,
      payment_method: paymentMethod,
      final_amount: finalAmount,
      shipping_info: shippingInfo,
      voucher,
      updated_loyalty_points: updatedLoyaltyPoints,
    }),
    });

    const result = await response.json();

    if (result.success) {
      const updatedUser = { ...user, loyalty_points: updatedLoyaltyPoints };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert(`Order placed! Final price: ₱${finalAmount.toFixed(2)}`);
      navigate("/");
    } else {
      alert(result.message || "Failed to place order.");
    }
  } catch (error) {
    console.error("Order error:", error);
    alert("Something went wrong.");
  }
};

// Points na deduct based sa selected na voucher
const getPointsToDeduct = (voucher) => {
  switch (voucher) {
    case "Basic Tier":
      return 500;
    case "Silver Tier":
      return 2000;
    case "Gold Tier":
      return 5000;
    case "Platinum Tier":
      return 10000;
    case "Elite Tier":
      return 20000;
    case "Black Tier":
      return 50000;
    default:
      return 0;
  }
};

  if (!car) return <div>Loading...</div>;

  const basePrice = car.price * quantity;
  const { price: discountedPrice, reason } = getDiscount();

  return (
  <div className="max-w-5xl mx-auto p-8 mt-10 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200">
    
    <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-700 hover:text-900 font-medium text-sm px-3 py-1 hover:border-gray-400 transition cursor-pointer select-none"
      >
        ← Go Back
      </button>

    <h1 className="text-4xl font-bold text-center text-gray-900 mb-10 tracking-tight">
      🧾 Finalize Your Order
    </h1>

    <div className="flex flex-col md:flex-row gap-10">
      {/* Car Image */}
      <div className="md:w-1/2 rounded-xl overflow-hidden shadow-md">
        <img
          src={`http://localhost/CustomersManagementSystem/Backend/uploads/${car.image}`}
          alt={car.model}
          className="w-full max-h-[300px] object-contain rounded-xl"
        />
      </div>

      {/* Car Details */}
      <div className="md:w-1/2 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {car.brand} <span className="text-blue-600">{car.model}</span>
          </h2>
          <p className="text-gray-600 text-sm">Only {car.stock_quantity} left in stock!</p>
        </div>

        <div>
          {/* <p className="text-base line-through text-gray-500 ml-2">
          ₱{discountedPrice.toLocaleString()}{" "} */}
          <span className="text-2xl font-bold text-green-600">
            ₱{basePrice.toLocaleString()}
          </span>
        {/* </p> */}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm">Quantity:</label>
          <input
            type="number"
            min={1}
            max={car.stock_quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Voucher */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Voucher</label>
          <select
            value={voucher}
            onChange={handleVoucherChange}
            disabled={isVoucherDropdownDisabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose a voucher --</option>
            {availableVouchers.map((voucherOption) => (
              <option
                key={voucherOption}
                value={voucherOption}
                disabled={voucherOption === "Black Tier" && blackTierUsed}
              >
                {voucherOption}
              </option>
            ))}
          </select>
          {reason && <p className="text-red-500 text-sm mt-1">{reason}</p>}
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>
    </div>

    {/* Shipping Info */}
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">🚚 Shipping Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          placeholder="Street Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="city"
          value={shippingInfo.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    {/* Final Actions */}
    <div className="mt-10 flex justify-end gap-4">
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={handlePlaceOrder}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md hover:scale-[1.03] transition-transform"
      >
        Place Order
      </button>
    </div>
  </div>
);

};

export default Checkout;
