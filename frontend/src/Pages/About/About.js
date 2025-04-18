import React from 'react';
import './About.css';
import image1 from '../../Photos/gautam.png';
import image2 from '../../Photos/leo.png';
import image3 from '../../Photos/profile_pic_parv.jpeg';
import image4 from '../../Photos/stephen.png';
import image5 from '../../Photos/Michael.jpg';
import image6 from '../../Photos/tom.jpeg';
import image7 from '../../Photos/Max.png';
import image8 from '../../Photos/jacob.jpeg';

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
    description: "Enter Description here"
  },
  {
    name: "Stephen ",
    title: "Backend Developer",
    image: image4,
    description: "Enter Description Here"
  },
  {
    name: "Michael Warner",
    title: "Frontend Developer",
    image: image5,
    description: "Enter Description Here"
  },
  {
    name: "Tom Than",
    title: "Backend Developer",
    image: image6,
    description: "Enter Description Here"
  },
  {
    name: "Max Zweiback",
    title: "Frontend Developer",
    image: image7,
    description: "Enter Description Here"
  },
  {
    name: "Jacob Hall",
    title: "Backend Developer",
    image: image8,
    description: "Enter Description Here"
  }
];

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">About PollPal</h1>
        <p className="text-lg text-gray-700 mb-6">
          PollPal is an activity recommendation platform that helps users discover amazing places around them. 
          Whether you're looking for restaurants, parks, or cultural spots, PollPal suggests personalized options 
          based on your preferences.
        </p>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Meet the Developers</h2>

        {/* Developer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center">
                <img src={dev.image} alt={dev.name} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-blue-500" />
                <h3 className="text-xl font-semibold text-gray-800">{dev.name}</h3>
                <p className="text-md text-gray-600 mb-2">{dev.title}</p>
                <p className="text-sm text-gray-500">{dev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
