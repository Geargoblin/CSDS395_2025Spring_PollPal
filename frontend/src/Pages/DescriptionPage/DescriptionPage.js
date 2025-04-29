import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './DescriptionPage.css';
import PhotoCarousel from '../../Components/PhotoCarousel';
import Review from '../../Components/Review/Review';

const DescriptionPage = () => {
  const [reviews, setReviews] = useState([]);
  const { state } = useLocation(); // Access the place data passed from PollPal
  const navigate = useNavigate();
  const place = state?.place;

  const handleBack = () => {
    navigate('/pollpal'); // Navigate to PollPal page
  };

  if (!place) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 mb-8"
      >
        &larr; Back to PollPal
      </button>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">

        {/* Place Name and Image */}
        <div className="text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-4">{place.name}</h3>
        </div>
        
        <PhotoCarousel photos={place.photos} />

        {/* Place Info - Description */}
        <div className="w-full mt-6 mb-6">
          <p className="text-center italic text-lg text-gray-600">{place.description ?? "No description available."}</p>
        </div>

        {/* Place Info - Rating, Category, Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="text-lg text-gray-700">
            <p><strong>Rating:</strong> {place.rating ?? "--"}</p>
            <p><strong>Number of Ratings:</strong> {place.user_ratings_total ?? "--"}</p>
          </div>

          <div className="text-lg text-gray-700">
            <p><strong>Category:</strong> {place.matched_type ?? "Activity"}</p>
            <p><strong>Address:</strong> {place.address ?? "(Unavailable)"}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Reviews</h2>
        {place.reviews && place.reviews.map((review, index) => (
          <Review
            key={index}
            text={review}
          />
        ))}
      </div>
    </div>
  );
}

export default DescriptionPage;
