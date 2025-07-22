import React from 'react';
import { Link } from 'react-router-dom';

const CommunityFooter = () => {
  return (
    <>
      {/* Footer */}
      <footer className="footer" style={{ paddingTop: 'var(--spacing-6)' }}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">MyHoustonHome</h3>
              <p className="footer-description">
                Discover exceptional homes in Houston's premier communities.
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/communities" className="footer-link">Communities</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Communities</h4>
              <ul className="footer-links">
                <li><Link to="/community/austin-point" className="footer-link">Austin Point</Link></li>
                <li><Link to="/community/emberly" className="footer-link">Emberly</Link></li>
                <li><Link to="/community/indigo" className="footer-link">Indigo</Link></li>
                <li><Link to="/community/stonecreek-estates" className="footer-link">Stonecreek Estates</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="footer-contact">
                <p>Houston, Texas</p>
                <p>Phone: (713) 555-0123</p>
                <p>Email: info@myhoustonhome.com</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} MyHoustonHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CommunityFooter; 