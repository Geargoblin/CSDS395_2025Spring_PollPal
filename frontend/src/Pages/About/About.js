import React from 'react';
import './About.css';
import image1 from '../../Photos/gautam.png';
import image2 from '../../Photos/leo.png';
import image3 from '../../Photos/profile_pic_parv.jpeg';


const developers = [
  {
    name: "Parv Bhardwaj",
    title: "Frontend Developer",
    image: image3,
    description: "Your description goes here"
  },
  {
    name: "Gautam Khandige",
    title: "Backend Developer",
    image: image1,
    description: "Your description goes here"
  },
  {
    name: "Leonardo Astorga",
    title: "Backend Developer",
    image: image2,
    description: "Designed PollPal's experience flow and conducted user testing for optimal usability."
  }
];

const About = () => {
  return (
    <div className="about-container">
      <h1>About PollPal</h1>
      <p>
        PollPal is an activity recommendation platform that helps users discover amazing places around them. 
        Whether you're looking for restaurants, parks, or cultural spots, PollPal suggests personalized options 
        based on your preferences.
      </p>

      <h2>Meet the Developers</h2>
      <div className="developer-grid">
        {developers.map((dev, index) => (
          <div key={index} className="developer-card">
            <img src={dev.image} alt={`${dev.name}`} />
            <h3>{dev.name}</h3>
            <p className="dev-title">{dev.title}</p>
            <p className="dev-desc">{dev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
