import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SignUp.css';

const SignUp = () => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [dob, setDob] = useState(null);
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
   const [showPassword, setShowPassword] = useState(true);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form className="signup-form">
        {/* Profile Picture Upload */}
        <label>Profile Picture (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <ReactCrop src={image} crop={crop} onChange={setCrop} onComplete={(c) => setCroppedImage(c)} />
        )}

        {/* First Name & Last Name */}
        <div className="name-fields">
          <div>
            <label>First Name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Last Name *</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
        </div>

        {/* Username */}
        <label>Username *</label>
        <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />

        {/* Email */}
        <label>Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

        {/* Password */}
        <label>Password *</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        <button
            type="button"
            className="show-password-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        {/* Date of Birth */}
        <label>Date of Birth *</label>
        <DatePicker selected={dob} onChange={(date) => setDob(date)} dateFormat="yyyy-MM-dd" required />

        {/* Phone Number */}
        <label>Phone Number (Optional)</label>
        <PhoneInput country={'us'} value={phone} onChange={setPhone} />

        <button type="submit" className="signup-btn">Create Account</button>
      </form>

      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
