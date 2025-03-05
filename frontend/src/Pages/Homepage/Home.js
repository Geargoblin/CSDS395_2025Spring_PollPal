import React from 'react';

import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to PollPal</h1>
        <p>PollPal is a recommendation app that suggests activities in the user’s local area. The user will be able to select the category of activity they are looking for, and they will be presented with options in their local area one at a time. If the user likes the recommendation, they can swipe right to save the recommendation. If they don’t like the recommendation, they can swipe left. After each swipe, a new recommendation will be presented automatically. The options that are recommended will be selected by analyzing the user’s previous likes and dislikes and suggesting options they may like based on their preferences. After the user has finished swiping through recommendations, they can go back and look at their saved activities at any time. If the user doesn’t want to swipe through recommendations, they can also view a list of trending activities in their area within any category based on other users’ swipes. 
        </p>
      </div>
    </div>
  );
};

export default Home;
