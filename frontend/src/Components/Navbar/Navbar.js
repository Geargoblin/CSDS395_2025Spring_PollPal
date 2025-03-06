import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import './Navbar.css';


const Navbar = ({ user, onLogout }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">PollPal</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/pollpal">PollPal</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>

        {!user ? (
          <>
            <li><Link to="/signin">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        ) : (
          <li className="profile-icon">
            <button onClick={() => setShowSidebar(!showSidebar)} className="profile-btn">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </button>
          </li>
        )}
      </ul>

      {showSidebar && user && <ProfileSidebar user={user} onLogout={onLogout} />}
    </nav>
  );
};

export default Navbar;