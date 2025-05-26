import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, setUser }) => {
  const [cars, setCars] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]); // Para sa Recommended For You 
  const [filteredCars, setFilteredCars] = useState([]); // Para sa pag filtered ng products
  const [selectedCategory, setSelectedCategory] = useState('All'); // Category filter state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.token;
  
    if (storedUser) {
      setUser(storedUser);
    }

    if (token) {
      fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/getUserProfile.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.type === 'success') {
            setUser(data.user);
          } else {
            setUser(null);
          }
        })
        .catch((err) => console.error('Error fetching user data:', err));
    }

    fetch('http://localhost/CustomersManagementSystem/Backend/Administrator/index.php')
      .then((res) => res.text())
      .then((data) => {
        try {
          const json = JSON.parse(data);
          setCars(json);

          const storedUser = JSON.parse(localStorage.getItem('user'));
          const onboardingData = storedUser && storedUser.email
            ? JSON.parse(localStorage.getItem(`onboarding_${storedUser.email}`)) || {}
            : {};
          const userPreferences = onboardingData.selectedCategories || [];
          console.log("User preferences from onboarding:", userPreferences);

          
          const recommended = userPreferences.length > 0
            ? json.filter(car => userPreferences.includes(car.category))
            : [];
            setRecommendedCars(recommended.slice(0, 10));

          const categoryFiltered = selectedCategory && selectedCategory !== 'All'
            ? json.filter(car => car.category === selectedCategory)
            : json;
          setFilteredCars(categoryFiltered);

        } catch (err) {
          console.error('Failed to parse JSON:', err);
        }
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [selectedCategory]); 
  
  const goToProfile = () => {
    navigate('/Profile', { state: { user } });
  };

  const categories = ['All', ...new Set(cars.map(car => car.category))];

  const goToOrder = (car) => {
    navigate('/order/:id', { state: { car } });
  }

  const toggleChat = () => {
    navigate('/chat');
  };

return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-gray-800">
    
    {/* Website Title */}
    <header className="mb-8 text-center">
      <h1 className="text-5xl font-extrabold text-cyan-600 drop-shadow-lg flex items-center justify-center gap-3 select-none">
        <span>RidePro</span>  
      </h1>
      <p className="text-gray-600 mt-1 text-lg font-medium">Your trusted car products hub</p>
    </header>

    {/* Hero Banner */}
    <section className="bg-gradient-to-r from-slate-700 to-cyan-500 rounded-2xl p-6 mb-10 shadow-lg flex flex-col sm:flex-row justify-between items-center">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Explore Quality Products</h2>
        <p className="mt-2 text-white text-base sm:text-lg">
          Browse and purchase top-tier Car Products with confidence and convenience.
        </p>
      </div>
      {user && (
        <div
          className="flex items-center mt-6 sm:mt-0 gap-3 bg-white bg-opacity-80 rounded-full px-4 py-2 shadow-md cursor-pointer"
          onClick={goToProfile}
        >
          <img
            src={`http://localhost/CustomersManagementSystem/Backend/uploads/${user.profile_image}`}
            alt="Profile"
            className="cursor-pointer w-10 h-10 rounded-full object-cover border border-white shadow"
          />
          <span className="text-sm text-gray-900 font-semibold">{user.customer_name}</span>
        </div>
      )}
    </section>

    {/* Category Filter */}
    <div className="cursor-pointer flex flex-col sm:flex-row justify-between items-center mb-8">
      <h2 className="text-xl font-semibold mb-3 sm:mb-0">Filter by Category</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Recommended Vehicles */}
    {recommendedCars.length > 0 && (
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Products for you</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedCars.map((car) => (
            <div
              key={car.product_id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              <img
                src={`http://localhost/CustomersManagementSystem/Backend/uploads/${car.image}`}
                alt={car.model}
                className="w-full h-28 object-contain bg-gray-50"
              />
              <div className="p-3 space-y-1.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold text-gray-900">{car.brand} {car.model}</h4>
                  <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full">{car.category}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{car.descriptions}</p>
                <p className="text-orange-600 font-bold text-base">₱{car.price}</p>
                <button
                  onClick={() => goToOrder(car)}
                  className="mt-2 w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-medium"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Available Cars */}
    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Available Products/Items</h3>
      {filteredCars.length === 0 ? (
        <p className="text-gray-500 text-base">There are no cars available in this category at the moment.</p>
      ) : (
        <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredCars.map((car) => (
            <div
              key={car.product_id}
              onClick={() => goToOrder(car)}
              className="cursor-pointer bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-transform hover:scale-105"
            >
              <img
                src={`http://localhost/CustomersManagementSystem/Backend/uploads/${car.image}`}
                alt={car.model}
                className="w-full h-28 object-contain bg-gray-50"
              />
              <div className="p-3 space-y-1.5">
                <h4 className="text-base font-semibold text-gray-900">{car.brand} {car.model}</h4>
                <p className="text-xs text-gray-500">{car.category}</p>
                <p className="text-xs text-gray-600 truncate">{car.descriptions}</p>
                <p className="text-orange-600 font-bold text-base">₱{car.price}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Stock: {car.stock_quantity}</span>
                  <span>ID: {car.product_id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Floating Chat Button */}
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={toggleChat}>
        <img
          src="/robot.png"
          alt="Profile"
          className="cursor-pointer transition-transform transform hover:scale-110 w-12 h-12 rounded-full object-cover ring-4 ring-indigo-500 shadow-2xl"
        />
      </button>
    </div>
  </div>
);


};

export default Home;
