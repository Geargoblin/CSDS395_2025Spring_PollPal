import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(formData);
    localStorage.setItem('user', JSON.stringify(formData));
    alert('Profile Updated Successfully');
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <label>Username</label>
      <input type="text" name="username" value={formData.username} onChange={handleInputChange} />

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

      <button onClick={handleSave} className="save-btn">Save Changes</button>
    </div>
  );
};

export default Profile;
