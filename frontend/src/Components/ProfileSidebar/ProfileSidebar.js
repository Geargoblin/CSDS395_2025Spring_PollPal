import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileSidebar.css';

const ProfileSidebar = ({ user, onLogout }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        // Logout successful
        onLogout()
        navigate('/signin');
      } else {
        setError(data.message || 'Logout failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  }

  return (
    <div className="profile-sidebar">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <Link to="/profile">Edit Profile</Link>
      <button onClick={handleLogout} className="logout-btn">Sign Out</button>
    </div>
  );
};

export default ProfileSidebar;
