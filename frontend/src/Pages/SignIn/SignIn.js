import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'test' && password === 'test@69') {
      const userData = { username: 'test', email: 'test@example.com' };
      onLogin(userData);
      navigate('/profile');
    } else {
      alert('Invalid username or password!');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="signin-btn">Login</button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
