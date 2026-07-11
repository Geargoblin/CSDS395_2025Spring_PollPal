import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import Select from 'react-select';

const SignUp = ({onLogin}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    date_of_birth: '',
    phone_number: '',
    location: '',
    preferences: [],
  });

  const options = [
    { value: 'food', label: 'Food' },
    { value: 'music', label: 'Music' },
    { value: 'outdoors', label: 'Outdoors' },
    { value: 'park', label: 'Park' },
    { value: 'museum', label: 'Museum' },
    { value: 'bar', label: 'Bar'},
    { value: 'active', label: 'Active'},
  ];

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://csds395-2025spring-pollpal.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 201) {
        // Registration successful, you could also log the user in here if needed
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form className="signup-form" onSubmit={handleSignUp}>
        <label>Username *</label>
        <input name="username" required onChange={handleChange} />

        <label>Email *</label>
        <input name="email" type="email" required onChange={handleChange} />

        <label>Password *</label>
        <input name="password" type="password" required onChange={handleChange} />

        <label>Date of Birth *</label>
        <input name="date_of_birth" type="date" required onChange={handleChange} />

        <label>Phone (optional)</label>
        <input name="phone_number" onChange={handleChange} />

        <label>Location</label>
        <input name="location" onChange={handleChange} />

        <label>Interests</label>
        <Select options = {options} isMulti name="preferences" 
        onChange={(selectedOptions) => {
          setFormData(prev => ({
            ...prev, preferences: selectedOptions.map(option => option.value)
          }));
        }}/>

        <button style={{ paddingTop: '12px' }} type="submit" className="signup-btn">Sign Up</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
