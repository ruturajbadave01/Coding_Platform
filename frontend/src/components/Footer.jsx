import React from 'react';
import { Link } from 'react-router-dom';
import collegeLogo from '../assets/college-logo.jpeg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Upper Footer Section */}
      <div className="footer-upper">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>For Students</h4>
            <ul>
              <li><Link to="/login">Practice Coding</Link></li>
              <li><Link to="/register">Join Contests</Link></li>
              <li><Link to="/student-dashboard">Student Dashboard</Link></li>
              <li><Link to="/">Leaderboard</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>For Departments</h4>
            <ul>
              <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
              <li><Link to="/login">Manage Students</Link></li>
              <li><Link to="/">View Analytics</Link></li>
              <li><Link to="/">Create Contests</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Features</h4>
            <ul>
              <li><Link to="/">Coding Challenges</Link></li>
              <li><Link to="/">Real-time Compilation</Link></li>
              <li><Link to="/">Progress Tracking</Link></li>
              <li><Link to="/">Performance Analytics</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Security</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Support</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/">Documentation</Link></li>
              <li><Link to="/">Tutorials</Link></li>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Press</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
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