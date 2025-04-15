import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import './Profile.css';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    date_of_birth: user.dob || '',
    phone_number: user.phone || '',
    //profilePic: user.profilePic || '',
  });
  const [message, setMessage] = useState('');

  const updateProfile = async (e) => {
    e.preventDefault()

    const response = await fetch('http://localhost:5001/api/user/update', {
      method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });

    const data = await response.json();

    if(response.status === 200){
      //Successfully updated user data
      setMessage("Successfully updated your information.");
    }
    else {
      //Error updating user data
      setMessage(data.message);
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

      {/* <div className="profile-image-section">
        <img src={formData.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p>Uploading image...</p>}
      </div> */}

      <label>Username</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />

      <label>Date of Birth</label>
      <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />

      <label>Phone</label>
      <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />

      <button onClick={updateProfile} className="save-btn">Save Changes</button>
      {message && <h3>{message}</h3>}
    </div>
  );
};

export default Profile;
