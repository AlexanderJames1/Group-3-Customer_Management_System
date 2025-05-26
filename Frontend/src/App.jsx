import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './Administration/Admin';
import AddProduct from './Administration/AddProduct';  
import Update from './Administration/Update';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Onboarding from './pages/Onboarding';
import Order from './pages/Order';
import Checkout from './pages/Checkout';
import CustomerSegmentation from './Administration/CustomerSegmentation';
import RasaChat from './pages/RasaChat';
import PageNotFound from './pages/PageNotFound'
import AdminSignIn from './Administration/AdminSignIn';
import AdminSignUp from './Administration/AdminSignUp';
import AdminProfile from './Administration/AdminProfile';
import EditAdminProfile from './Administration/EditAdminProfile';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); 

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAdmin = localStorage.getItem('admin');
      setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); 

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route: Home or redirect to Sign-in */}
        <Route path="/" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/Sign-in" />} />
        <Route path="/admin" element={admin ? <Admin admin={admin} setAdmin={setAdmin} /> : <Navigate to="/AdminSignIn" />} />

        {/* Public Routes */}
        <Route path="/Sign-in" element={user ? <Navigate to="/" /> : <SignIn setUser={setUser} />} />
        <Route path="/Sign-up" element={user ? <Navigate to="/" /> : <SignUp setUser={setUser} />} />
        <Route path="/AdminSignIn" element={admin ? <Navigate to="/admin" /> : <AdminSignIn setAdmin={setAdmin} />} />
        <Route path="/AdminSignUp" element={admin ? <Navigate to="/admin" /> : <AdminSignUp setAdmin={setAdmin} />} />

        {/* Protected Routes */}
        <Route path="*" element={<PageNotFound />} />
        <Route path="/chat" element={user ? <RasaChat /> : <Navigate to="/Sign-in" />} />
        <Route path="/add-product" element={user ? <AddProduct /> : <Navigate to="/Sign-in" />} />
        <Route path="/update-product/:id" element={user ? <Update /> : <Navigate to="/Sign-in" />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/Sign-in" />} />
        <Route path="/edit-profile/:id" element={user ? <EditProfile /> : <Navigate to="/Sign-in" />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/Sign-in" />} />
        <Route path="/order/:id" element={user ? <Order /> : <Navigate to="/Sign-in" />} />
        <Route path="/checkout/:id" element={user ? <Checkout /> : <Navigate to="/Sign-in" />} />
        <Route path="/segments" element={user ? <CustomerSegmentation /> : <Navigate to="/Sign-in" />} />

        {/* ADMIN Protected Routes */}
        <Route path="/edit_admin" element={admin ? <EditAdminProfile /> : <Navigate to="/AdminSignIn" />} />
        <Route path="/AdminProfile" element={admin ? <AdminProfile admin={admin} setAdmin={setAdmin} /> : <Navigate to="/AdminSignIn" />} />
      </Routes>
    </Router>
  );
}

export default App;
