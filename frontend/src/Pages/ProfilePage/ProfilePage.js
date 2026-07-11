import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the user profile from the backend API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://csds395-2025spring-pollpal.onrender.com/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await response.json();

        if (response.status === 200) {
          setUserProfile(data.user);
        } else {
          setMessage(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error(err);
        setMessage('Server error. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile'); // Navigate to the edit profile page
  };

  if (!userProfile) {
    return <p className="text-center text-lg text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Profile</h2>

      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">Name:</div>
          <div className="text-gray-700">{userProfile.username}</div>
        </div>
        
        <div className="flex justify-between">
          <div className="font-semibold text-lg">Email:</div>
          <div className="text-gray-700">{userProfile.email}</div>
        </div>

        <div className="flex justify-between">
          <div className="font-semibold text-lg">Phone:</div>
          <div className="text-gray-700">{userProfile.phone_number || 'Not provided'}</div>
        </div>

        <div className="flex justify-between">
          <div className="font-semibold text-lg">Date of Birth:</div>
          <div className="text-gray-700">{userProfile.date_of_birth || '02/01/2002'}</div>
        </div>

        <div className="flex justify-between">
          <div className="font-semibold text-lg">Location:</div>
          <div className="text-gray-700">{userProfile.location || 'Cleveland'}</div>
        </div>

        <div className="flex justify-between">
          <div className="font-semibold text-lg">Interests:</div>
          <div className="text-gray-700">{userProfile.preferences?.join(', ') || 'Senior Project'}</div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleEditProfile}
            className="py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
    </div>
  );
};

export default ProfilePage;
