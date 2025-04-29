import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import './DescriptionPage.css';
import PhotoCarousel from '../../Components/PhotoCarousel';
import Review from '../../Components/Review/Review';

const DescriptionPage = (props) => {
  const [reviews, setReviews] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const { id } = useParams(); // Extract activity ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state?.place; // Access the place data passed from PollPal

  const handleBack = () => {
    navigate('/pollpal'); // Navigate to PollPal page
  };

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
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">{place.name}</h3>
        <PhotoCarousel photos={place.photos} />

        {/* Place Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="text-lg text-gray-700">
            <p><strong>Rating:</strong> {place.rating ?? "--"}</p>
            <p><strong>Number of Ratings:</strong> {place.user_ratings_total ?? "--"}</p>
            <p><strong>Category:</strong> {place.matched_type ?? "Activity"}</p>
            <p><strong>Address:</strong> {place.address ?? "(Unavailable)"}</p>
          </div>

          {/* Description */}
          <div className="text-lg text-gray-700">
            <p className="italic">{place.description ?? "No description available."}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8">Reviews</h2>
        {place.reviews.map((review, index) => (
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
