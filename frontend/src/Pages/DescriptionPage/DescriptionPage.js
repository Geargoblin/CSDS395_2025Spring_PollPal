import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import './DescriptionPage.css';
import PhotoCarousel from '../../Components/PhotoCarousel';

const DescriptionPage = (props) => {
    const [reviews, setReviews] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const { id } = useParams(); // Extract activity ID from URL
    const location = useLocation();
    const place = location.state?.place

    return (
        <div>
            <div className='centered'>
                <>
                    <h1 className='centered'>{place.name}</h1>
                    <PhotoCarousel photos={[place.photo_1, place.photo_2, place.photo_3, place.photo_4]}/>
                    <div className='four-col'>
                        <p>Likes: {place.numLikes ?? "24"}</p>
                        <p>Rating: {place.starRating ?? "⭐⭐⭐⭐"}</p>
                        <p>Category: {place.category ?? "Activity"}</p>
                        <p>Operating Hours: {place.operatingHours ?? "9AM-5PM"}</p>
                    </div>
                </>
            </div>
            <h2>Reviews</h2>
            <div className="review-box">⭐⭐⭐⭐ Great place!</div>
            <div className="review-box">⭐⭐ Average experience.</div>
            <div className="review-box">⭐ Not worth it!</div>
        </div>
    )
}

export default DescriptionPage;