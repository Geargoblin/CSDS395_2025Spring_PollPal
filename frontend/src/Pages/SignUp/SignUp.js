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
    password: '',
    dob: '',
    phone: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { username, email, password, dob, phone } = formData;
  
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
  
      const profileData = {
        uid: user.uid,
        username,
        email,
        dob,
        phone,
        profilePic: '', // default
        createdAt: new Date().toISOString()
      };
  
      await setDoc(doc(db, 'users', user.uid), profileData);
  
      // Save user and navigate
      localStorage.setItem('user', JSON.stringify(profileData));
      alert('Signed up successfully!');
      onLogin(profileData);  // update app-level state
      navigate('/profile');
    } catch (err) {
      setError(err.message);
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
        <input name="dob" type="date" required onChange={handleChange} />

        <label>Phone (optional)</label>
        <input name="phone" onChange={handleChange} />

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
