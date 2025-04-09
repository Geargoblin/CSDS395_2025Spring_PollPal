import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Please fill out the form below.</p>

      <div className="contact-form-wrapper">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfN9PNO_w1E6xImN3uP8IDQFytSMa9h9BvlyCCXEjCvWW8fNA/viewform?embedded=true"
          width="100%"
          height="966"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Contact Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default Contact;
