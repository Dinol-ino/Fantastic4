// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container flex justify-between" style={{ height: '100%' }}>
        <Link to="/" className="nav-logo">BlockEstate</Link>
        <div className="nav-links flex">
          <a href="#process">How it Works</a>
          <Link to="/login">Log In</Link>
          <Link to="/register" className="btn-nav">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;