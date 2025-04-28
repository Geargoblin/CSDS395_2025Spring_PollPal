import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import './DescriptionPage.css';
import PhotoCarousel from '../../Components/PhotoCarousel';
import Review from '../../Components/Review/Review';

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
                    <PhotoCarousel photos={place.photos} />
                    <div className='four-col'>
                        <p>Rating: {place.rating ?? "--"}</p>
                        <p>Number of Ratings: {place.user_ratings_total ?? "--"}</p>
                        <p>Category: {place.matched_type ?? "Activity"}</p>
                        <p>Address: {place.address ?? "(Unavailable)"}</p>
                    </div>
                    <p>{place.description}</p>
                </>
            </div>
            <h2>Reviews</h2>
            {place.reviews.map((review, index) => (
                <Review
                    key={index}
                    text={review}
                />
            ))}
        </div>
    )
}

export default DescriptionPage;