import React, { useState } from 'react';
import './PollPal.css';

const PollPal = () => {
  const [selectedCategory, setSelectedCategory] = useState('Restaurants');
  const [selectedLocation, setSelectedLocation] = useState('Cleveland');
  const [selectedDistance, setSelectedDistance] = useState('5 miles');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://via.placeholder.com/300", 
    "https://via.placeholder.com/300/111", 
    "https://via.placeholder.com/300/222"
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="pollpal-container">
      
      {/* Left Sidebar - Filters */}
      <div className="sidebar">
        <h3>Filters</h3>
        <label>Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option>Restaurants</option>
          <option>Cafes</option>
          <option>Parks</option>
          <option>Museums</option>
        </select>

        <label>Location:</label>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option>Cleveland</option>
          <option>New York</option>
          <option>Los Angeles</option>
          <option>Chicago</option>
        </select>

        <label>Distance:</label>
        <select value={selectedDistance} onChange={(e) => setSelectedDistance(e.target.value)}>
          <option>5 miles</option>
          <option>10 miles</option>
          <option>20 miles</option>
        </select>
      </div>

      {/* Middle Section - Activity Card */}
      <div className="activity-card">
        <button className="nav-arrow left" onClick={handlePrevImage}>←</button>
        <div className="activity-content">
          <img src={images[currentImageIndex]} alt="Activity" className="activity-image"/>
          <h2>Activity Name</h2>
          <p>Description of the activity...</p>
          <div className="action-buttons">
            <button className="dislike">✖</button>
            <button className="like">✔</button>
          </div>
        </div>
        <button className="nav-arrow right" onClick={handleNextImage}>→</button>
      </div>

      {/* Right Sidebar - Reviews */}
      <div className="reviews-section">
        <h3>Reviews</h3>
        <div className="review-box">⭐⭐⭐⭐ Great place!</div>
        <div className="review-box">⭐⭐ Average experience.</div>
        <div className="review-box">⭐ Not worth it!</div>
      </div>
    </div>
  );
};

export default PollPal;
