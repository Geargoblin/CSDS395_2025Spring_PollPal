import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Pages/Homepage/Home';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import Profile from './Pages/Profile/Profile';
import Navbar from './Components/Navbar/Navbar';
import PollPal from './Pages/PollPal/PollPal';
import DescriptionPage from './Pages/DescriptionPage/DescriptionPage';
import Contact from './Pages/Contact/Contact';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import About from './Pages/About/About';
import ProfilePage from './Pages/ProfilePage/ProfilePage';

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/show-profile" element={<ProfilePage />} />

          <Route path="/" element={<Home />} />
          <Route path="/pollpal" element={
              <PrivateRoute user={user}>
                  <PollPal />
              </PrivateRoute> } />

          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />

          <Route path="/profile" element={
                <PrivateRoute user={user}>
                    <Profile user={user} onUpdate={setUser} />
                </PrivateRoute>
} />
          <Route path="/activity/:id" element={<DescriptionPage />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;