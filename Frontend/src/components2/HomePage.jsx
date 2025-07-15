import React, { useState, useEffect } from "react";
import "./Homepage.css";
import logoNSS from "../assets/nss123.png";
import logoCharusat from "../assets/5.jpg";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import bg4 from "../assets/bg4.jpg";
import { FaBars, FaTimes } from "react-icons/fa";

const images = [bg1, bg2, bg3, bg4];

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Background Slideshow */}
      <div className="background-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Background ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <img src={logoCharusat} alt="Charusat Logo" className="charusat-logo" />
        <img src={logoNSS} alt="NSS Logo" className="nSs-logo" />
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Our Team</a></li>
          <li><a href="#">Events & Activities</a></li>
        </ul>
        <button className="sign-in">Sign In</button>
      </nav>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="text-section">
          <h1>
            Welcome to <span className="highlight">CHARUSAT NSS.</span>
          </h1>
          <p className="pera">
            The National Service Scheme (NSS) is a Central Sector Scheme of Government of India, Ministry of Youth Affairs & Sports.
            It provides an opportunity to students to take part in various community service activities & programmes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;