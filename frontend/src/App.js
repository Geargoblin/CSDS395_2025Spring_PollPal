import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Homepage/Home';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
