import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import './PollPal.css';

const PollPal = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5001/places')
      .then(response => response.json())
      .then(data => setPlaces(data))
      .catch(error => console.error("Error fetching places:", error));
  }, []);

  const handleNext = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
      setSwipeDirection(null);
    }, 500); // Animation duration
  };

  const handleLike = async () => {
    setError('');
    try {
      const url = "http://localhost:5001/api/user/places/like/" + places[currentIndex].name
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 200) {
        //Succesfully liked
        handleNext('right');
      } else {
        setError(data.message || 'Failed to like.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  }

  const handleDislike = async () => {
    setError('');
    try {
      const url = "http://localhost:5001/api/user/places/dislike/" + places[currentIndex].name
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 200) {
        //Succesfully disliked
        handleNext('left');
      } else {
        setError(data.message || 'Failed to dislike.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  }

  const navigate = useNavigate();

  // Navigate when clicking anywhere in the card
  const handleCardClick = () => {
    navigate(`/activity/${places[currentIndex].name}`, { state: { place: places[currentIndex] } }); // Navigate to the activity details page
  };

  if (places.length === 0) return <p>Loading...</p>;

  return (
    <div className="pollpal-container">

      {/* Sidebar - Filters */}
      <div className="sidebar">
        <h3>Filters</h3>
        <label>Category:</label>
        <select>
          <option>Restaurants</option>
          <option>Cafes</option>
          <option>Parks</option>
          <option>Museums</option>
        </select>
      </div>

      {/* Activity Display */}
      <div className="activity-card" onClick={handleCardClick}>
        <AnimatePresence>
          <motion.div
            key={places[currentIndex].name}
            className="activity-content"
            initial={{ x: 0, opacity: 1, scale: 1 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{
              x: swipeDirection === 'right' ? 300 : -300,
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15
            }}
          >
            <img src={places[currentIndex].image} alt={places[currentIndex].name} className="activity-image" />
            <h2>{places[currentIndex].name}</h2>
            <p>{places[currentIndex].description}</p>
            <div className="action-buttons">
              <button className="dislike" onClick={(e) => { e.stopPropagation(); handleDislike(); }}>✖</button>
              <button className="like" onClick={(e) => { e.stopPropagation(); handleLike(); }}>✔</button>
            </div>
            {error && <h2>{error}</h2>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reviews Section */}
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
