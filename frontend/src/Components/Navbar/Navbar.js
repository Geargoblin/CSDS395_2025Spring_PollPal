import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl font-bold">PollPal</div>
        <ul className="flex space-x-6 text-white">
          <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
          <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link to="/pollpal" className="hover:text-gray-200">PollPal</Link></li>
          <li><Link to="/contact" className="hover:text-gray-200">Contact Us</Link></li>

          {!user ? (
            <>
              <li><Link to="/signin" className="hover:text-gray-200">Login</Link></li>
              <li><Link to="/signup" className="hover:text-gray-200">Sign Up</Link></li>
            </>
          ) : (
            <li className="relative">
              <button 
                onClick={() => setShowSidebar(!showSidebar)} 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:bg-gray-100">
                {user.username ? user.username[0].toUpperCase() : "U"}
              </button>
            </li>
          )}
        </ul>
      </div>

      {showSidebar && user && <ProfileSidebar user={user} onLogout={onLogout} />}
    </nav>
  );
};

export default Navbar;
