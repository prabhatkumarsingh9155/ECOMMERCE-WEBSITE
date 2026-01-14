import React from 'react';
import './Footer.css';

const Footer = ({ navigateTo }) => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Logo Section - Centered at top */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src="/Image/Logo1.png" alt="Gbru Logo" className="footer-logo-img" />
            
          </div>
          <p className="footer-description">
            Your trusted online shopping destination with quality products, 
            fast delivery, and excellent customer service.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">💼</a>
          </div>
        </div>

        {/* Links Section - Horizontal */}
        <div className="footer-content">
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('home')}>Home</button></li>
              <li><button onClick={() => navigateTo('products')}>Products</button></li>
              <li><button onClick={() => navigateTo('cart')}>Cart</button></li>
              <li><button onClick={() => navigateTo('auth')}>Account</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Size Guide</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 Gbru. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;