import { useState } from "react";

function Review({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <p
        className={`text-gray-800 ${
          expanded ? '' : 'line-clamp-3 overflow-hidden'
        }`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'none' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 text-blue-500 hover:underline focus:outline-none"
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
}

export default Review;