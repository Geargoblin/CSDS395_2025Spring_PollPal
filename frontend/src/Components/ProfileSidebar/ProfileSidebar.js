import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileSidebar.css';

const ProfileSidebar = ({ user, onLogout }) => {
  return (
    <div className="profile-sidebar">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <Link to="/profile">Edit Profile</Link>
      <button onClick={onLogout} className="logout-btn">Sign Out</button>
    </div>
  );
};

export default ProfileSidebar;
