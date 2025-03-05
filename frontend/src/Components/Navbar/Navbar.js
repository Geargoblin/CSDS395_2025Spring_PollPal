import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Home from '../../Pages/Homepage/Home';
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">PollPal</div>
      <ul className="nav-links">
   
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/help">Help</Link></li>
        <li><Link to="/login" className="login-btn">Login/Signup</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
