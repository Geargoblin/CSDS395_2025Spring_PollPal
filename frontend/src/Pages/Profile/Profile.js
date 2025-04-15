import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import './Profile.css';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    dob: user.dob || '',
    phone: user.phone || '',
    profilePic: user.profilePic || '',
  });

  const getCurrentUser = async () => {
    const response = await fetch('http://localhost:5001/api/auth/me', {
      method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const data = await response.json();

    if(response.status === 200){
      //Successfully retrieved user data
      
    }
    else {
      //Error retrieving user data

    }
  }

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imgRef = ref(storage, `profile-pics/${uuidv4()}-${file.name}`);
    await uploadBytes(imgRef, file);
    const downloadURL = await getDownloadURL(imgRef);

    setFormData(prev => ({ ...prev, profilePic: downloadURL }));
    setUploading(false);
  };

  const handleSave = async () => {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      username: formData.username,
      dob: formData.dob,
      phone: formData.phone,
      profilePic: formData.profilePic
    });

    const updatedUser = { ...user, ...formData };
    onUpdate(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      <div className="profile-image-section">
        <img src={formData.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p>Uploading image...</p>}
      </div>

      <label>Username</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />

      <label>Date of Birth</label>
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

      <label>Phone</label>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

      <button onClick={handleSave} className="save-btn">Save Changes</button>
    </div>
  );
};

export default Profile;
