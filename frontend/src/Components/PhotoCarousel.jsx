import { useState } from "react";

function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={(event) => {
          event.stopPropagation(); // prevent parent div's click
          goToPrevious();
        }} style={{ fontSize: "1rem", marginRight: "10px" }}>
        ◀
      </button>

      <div
        style={{
          width: "400px",
          height: "300px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <img
          src={photos[currentIndex]}
          alt="Failed to load image."
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <button onClick={(event) => {
          event.stopPropagation(); // prevent parent div's click
          goToNext();
        }} style={{ fontSize: "1rem", marginLeft: "10px" }}>
        ▶
      </button>
    </div>

  );
}

export default PhotoCarousel;
