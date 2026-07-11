import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileSidebar.css';

const ProfileSidebar = ({ user, onLogout }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://csds395-2025spring-pollpal.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status === 200) {
        onLogout();
        navigate('/signin');
      } else {
        setError(data.message || 'Logout failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-6 absolute top-16 right-4 z-10">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{user.username}</h3>
      <p className="text-sm text-gray-600 mb-4">{user.email}</p>
      <Link to="/profile" className="block text-blue-600 hover:text-blue-800 mb-2">Edit Profile</Link>
      <Link to="/show-profile" className="text-blue-600 hover:text-blue-800"> Show Profile</Link>
      <button 
        onClick={handleLogout}
        className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition">
        Sign Out
      </button>
       
   
 
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default ProfileSidebar;
