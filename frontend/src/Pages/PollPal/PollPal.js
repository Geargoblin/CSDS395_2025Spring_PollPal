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
    navigate(`/activity/${places[currentIndex].name}`, { state: { place: places[currentIndex] } });
  };

  if (places.length === 0) return <p className="text-center text-lg text-gray-600">Loading...</p>;

  return (
    <div className="flex gap-8 p-8">

      {/* Sidebar - Filters */}
      <div className="w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4">Filters</h3>
        <label className="block text-lg font-medium mb-2">Category:</label>
        <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Restaurants</option>
          <option>Cafes</option>
          <option>Parks</option>
          <option>Museums</option>
        </select>
      </div>

      {/* Activity Card Section */}
      <div className="w-2/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <AnimatePresence>
          <motion.div
            key={places[currentIndex].name}
            className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleCardClick}
          >
            <img src={places[currentIndex].image} alt={places[currentIndex].name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="font-semibold text-2xl mb-2">{places[currentIndex].name}</h2>
            <p className="text-gray-600 mb-4">{places[currentIndex].description}</p>
            <div className="flex justify-between items-center">
              <button
                className="w-20 h-20 bg-red-500 text-white text-3xl rounded-full hover:bg-red-600 transition-all"
                onClick={(e) => { e.stopPropagation(); handleDislike(); }}
              >
                ✖
              </button>
              <button
                className="w-20 h-20 bg-green-500 text-white text-3xl rounded-full hover:bg-green-600 transition-all"
                onClick={(e) => { e.stopPropagation(); handleLike(); }}
              >
                ✔
              </button>
            </div>
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reviews Section */}
      <div className="w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4">Reviews</h3>
        <div className="bg-white p-4 mb-2 rounded-lg shadow-sm">⭐⭐⭐⭐ Great place!</div>
        <div className="bg-white p-4 mb-2 rounded-lg shadow-sm">⭐⭐ Average experience.</div>
        <div className="bg-white p-4 mb-2 rounded-lg shadow-sm">⭐ Not worth it!</div>
      </div>
    </div>
  );
};

export default PollPal;
