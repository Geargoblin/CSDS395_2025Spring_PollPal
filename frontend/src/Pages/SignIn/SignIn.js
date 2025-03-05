import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form">
        <label>Username or Email</label>
        <input type="text" placeholder="Enter your username or email" required />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button type="submit" className="signin-btn">Login</button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
