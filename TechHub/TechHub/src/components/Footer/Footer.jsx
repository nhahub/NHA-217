import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Blue Header Bar */}
      <div className="footer-top-bar">
        <div className="footer-top-container">
          <span className="footer-top-text">Get connected with us</span>
          <div className="footer-top-links">
            <a href="tel:+20248813824" className="footer-top-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5L11 8l-5.5 4.5V3.5z"/>
              </svg>
              <span>+20248813824</span>
            </a>
            <a href="https://wa.me/20248813824" className="footer-top-link" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" fill="currentColor"/>
              </svg>
              <span>WhatsApp support</span>
            </a>
            <Link to="/contact" className="footer-top-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-1.68-.154c-.93.164-1.818.26-2.649.33z"/>
              </svg>
              <span>Send us your feedback</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main White Content Area */}
      <div className="footer-main">
        <div className="footer-main-container">
          {/* Company Logo */}
          <div className="footer-logo-section">
            <div className="footer-logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0056CC" stopOpacity="1" />
                    <stop offset="100%" stopColor="#003d99" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="8" height="28" fill="url(#footerGradient)" rx="4"/>
                <rect x="4" y="14" width="8" height="6" fill="#E63946" rx="3"/>
                <rect x="4" y="26" width="8" height="6" fill="#E63946" rx="3"/>
                <circle cx="8" cy="8" r="2.5" fill="url(#footerGradient)"/>
                <circle cx="8" cy="17" r="2" fill="#FFFFFF"/>
                <circle cx="8" cy="29" r="2" fill="#FFFFFF"/>
                <path d="M 12 4 L 12 32" stroke="url(#footerGradient)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M 12 17 L 20 17" stroke="url(#footerGradient)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M 12 29 L 20 29" stroke="url(#footerGradient)" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="20" y="4" width="8" height="28" fill="url(#footerGradient)" rx="4"/>
                <circle cx="24" cy="8" r="2.5" fill="#E63946"/>
                <circle cx="24" cy="17" r="2" fill="#FFFFFF"/>
                <circle cx="24" cy="29" r="2" fill="#FFFFFF"/>
              </svg>
            </div>
            <h2 className="footer-logo-text">TechHub</h2>
            <p className="footer-logo-tagline">YOUR ELECTRONICS HUB</p>
          </div>

          {/* Top Categories */}
          <div className="footer-section">
            <h4 className="footer-heading">Top Categories</h4>
            <ul className="footer-links">
              <li><Link to="/categories">Super Bags</Link></li>
              <li><Link to="/categories">Tools</Link></li>
              <li><Link to="/categories">Sensors</Link></li>
            </ul>
            <Link to="/products" className="footer-browse-link">
              Browse All Products
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link-active">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/dashboard">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.88L8 10.08l-6.966 4.183A1 1 0 0 0 2 15h12a1 1 0 0 0 .966-.737ZM1 11.105l4.708-2.897L1 5.383v5.722Z" fill="currentColor"/>
                </svg>
                <span>Email: info@techhub-electronics.com</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" fill="currentColor"/>
                </svg>
                <span>Follow us on Facebook</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="currentColor"/>
                </svg>
                <span>Address: 158 Elhourya St. Elibrahymia, Alexandria, Egypt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Blue Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p>&copy; 2025 TechHub Electronics. All rights reserved</p>
        </div>
      </div>

      {/* Floating WhatsApp Icon */}
      <motion.a 
        href="https://wa.me/20248813824" 
        className="footer-whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          y: { 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          } 
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M16 4C9.373 4 4 9.373 4 16c0 2.165.572 4.19 1.57 5.945L4 28l6.055-1.57A11.95 11.95 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 4 16 4zm6.5 17.5c-.35.99-1.75 1.8-2.4 2.05-.65.25-1.5.4-2.7.7-1.2.3-2.85.35-4.4-.15-1.55-.5-2.7-1.4-3.75-2.5-1.3-1.35-2.3-3.05-2.85-4.75-.55-1.7-.1-3.35.25-4.35.35-1 1.2-2.1 1.65-2.4.45-.3.95-.45 1.25-.45.3 0 .6.05.85.1.25.05.6.15.85.6.25.45.85 1.75.95 1.9.1.15.2.3.1.6-.1.3-.1.5-.2.7-.1.2-.2.4-.3.55-.1.15-.2.3-.4.45-.2.15-.4.3-.6.45-.2.15-.4.25-.6.4-.2.15-.15.3-.1.5.05.2.25.85.55 1.4.3.55.6 1.05.95 1.5.7.9 1.5 1.6 2.4 2.05.9.45 1.4.35 1.9.2.5-.15 2.1-1 2.4-1.2.3-.2.5-.15.85.05.35.2 2.2 1.3 2.6 1.5.4.2.7.3.8.5.1.2.1.35.05.5-.05.15-.2.3-.45.5z" fill="white"/>
        </svg>
      </motion.a>
    </footer>
  );
};

export default Footer;
