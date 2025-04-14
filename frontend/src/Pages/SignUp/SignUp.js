import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({onLogin}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: 'Test',
    last_name: 'Test',
    password: '',
    date_of_birth: '',
    phone_number: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
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

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
