import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Pages/Homepage/Home';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import Profile from './Pages/Profile/Profile';
import Navbar from './Components/Navbar/Navbar';
function App() {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      // Check if user is logged in from local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    }, []);
  
    const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    };
  
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };
  
    return (
      <Router>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;