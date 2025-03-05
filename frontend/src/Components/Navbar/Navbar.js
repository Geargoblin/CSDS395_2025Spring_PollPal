import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">My Website</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/help">Help</Link></li>
        <li><Link to="/signin" className="login-btn">Login/Signup</Link></li>
        <li><Link to="/signup" className="signup-btn">Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
