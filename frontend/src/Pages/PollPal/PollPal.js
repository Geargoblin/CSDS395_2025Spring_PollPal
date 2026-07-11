import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import './PollPal.css';
import PhotoCarousel from '../../Components/PhotoCarousel.jsx';
import Review from '../../Components/Review/Review.js';

const PollPal = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("Any");

  useEffect(() => {
    getNextTen()
  }, []);

  const getNextTen = async (category) => {
    setError('');

    var fetch_url = ""
    switch(category){
      case "Restaurants":
        fetch_url = "https://csds395-2025spring-pollpal.onrender.com/api/match?category=restaurant";
        break;
      case "Cafes":
        fetch_url = "https://csds395-2025spring-pollpal.onrender.com/api/match?category=cafe";
        break;
      case "Tourist Attractions":
        fetch_url = "https://csds395-2025spring-pollpal.onrender.com/api/match?category=tourist_attraction";
        break;
      case "Parks":
        fetch_url = "https://csds395-2025spring-pollpal.onrender.com/api/match?category=park";
        break;
      default:
        fetch_url = "https://csds395-2025spring-pollpal.onrender.com/api/match"
        break;
    }

    try {
      const url = fetch_url;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 200) {
        setPlaces(data.matches)
      } else {
        setError(data.message || 'Failed to fetch places.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  const handleNext = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
      if (currentIndex === 0) {
        getNextTen(selectedCategory);
      }
      setSwipeDirection(null);
    }, 500); // Animation duration
  };

  const handleLike = async () => {
    setError('');
    try {
      const url = "https://csds395-2025spring-pollpal.onrender.com/api/user/places/like/" + places[currentIndex].id
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
      const url = "https://csds395-2025spring-pollpal.onrender.com/user/places/dislike/" + places[currentIndex].id
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

  const handleFilter = (category) => {
    console.log(category);
    setSelectedCategory(category);
    getNextTen(category);
  }

  const navigate = useNavigate();

  // Navigate when clicking anywhere in the card
  const handleCardClick = () => {
    navigate(`/activity/${places[currentIndex].id}`, { state: { place: places[currentIndex] } });
  };

  if (places.length === 0) return <p className="text-center text-lg text-gray-600">Loading...</p>;

  return (
    <div className="flex gap-8 p-8">

      {/* Sidebar - Filters */}
      <div className="w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4">Filters</h3>
        <label className="block text-lg font-medium mb-2">Category:</label>
        <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}>
            <option>Any</option>
            <option>Restaurants</option>
            <option>Cafes</option>
            <option>Parks</option>
            <option>Tourist Attractions</option>
        </select>
      </div>

      {/* Activity Card Section */}
      <div className="w-2/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
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
            <PhotoCarousel photos={places[currentIndex].photos} />
            <h2 className="font-semibold text-2xl mb-2 text-center">{places[currentIndex].name}</h2>
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
        {places[currentIndex].reviews.map((review, index) => (
          <Review
            key={index}
            text={review}
          />
        ))}
      </div>
    </div>
  );
};

export default PollPal;
