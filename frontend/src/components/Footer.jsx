import React from 'react';
import { Link } from 'react-router-dom';
import collegeLogo from '../assets/college-logo.jpeg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Upper Footer Section Removed as requested */}
      
      {/* Lower Footer Section */}
      <div className="footer-lower">
        <div className="footer-lower-content">
          <div className="footer-left">
            <div className="footer-logo-section">
              <img src={collegeLogo} alt="SKN College Logo" className="college-logo" />
              <div className="footer-logo">
                <h3>SKN <span>CODEMATE</span></h3>
              </div>
            </div>
            <p className="footer-tagline">
              Level up your coding skills. Compete, practice, and join the leaderboard!
            </p>
            <div className="footer-badges">
              <span className="badge">Top Platform</span>
              <span className="badge">Secure</span>
              <span className="badge">Reliable</span>
            </div>
          </div>
          
          <div className="footer-middle">
            <div className="contact-info">
              <h4>Contact Information</h4>
              <p>SKN Sinhgad College of Engineering</p>
              <p>Korti, Pandharpur - 413304</p>
              <p>Maharashtra, India</p>
             
              <p>Email: sknadmin@sknscoe.ac.in</p>
            </div>
          </div>
          
          <div className="footer-right">
            <div className="help-widget">
              <button className="help-btn">
                <span className="help-icon">✨</span>
                How does SKN CODEMATE work?
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 