import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-purple-600 flex items-center justify-center">
      <div className="text-center p-6 sm:p-12 md:p-16 bg-white bg-opacity-80 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Welcome to PollPal.  
        </h1>
     <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          NOTE: Partially deployed-some features may not work.  
        </h1>
        <p className="text-lg text-gray-800 mb-8">
          PollPal is a recommendation app that suggests activities in the user’s local area. You can select the category of activity you're looking for, and we'll present personalized recommendations based on your preferences. You can swipe right to save or left to dismiss recommendations, and easily view your saved activities later.
        </p>
        <div className="flex justify-center gap-6">
          <a href="/signup">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full transition duration-300 transform hover:bg-blue-700 hover:scale-105">
              Sign Up Now
            </button>
          </a>
          <a href="/pollpal">
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full transition duration-300 transform hover:bg-green-700 hover:scale-105">
              Explore PollPal
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
