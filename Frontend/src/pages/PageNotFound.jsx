import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-800 to-cyan-700 text-white px-4">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="text-2xl sm:text-3xl font-semibold">Page Not Found</p>
        <p className="text-sm sm:text-base text-slate-300">
          Sorry, the page you’re looking for doesn’t exist. It might have been moved or deleted.
        </p>
        <button
          onClick={goHome}
          className="mt-6 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-md hover:bg-cyan-100 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
