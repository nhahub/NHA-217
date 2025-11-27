import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Contact.css';

const Contact = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="contact-page">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Banner Section */}
      <div className="contact-banner">
        <h1 className="banner-text">WE HEAR YOU.</h1>
      </div>

      {/* Main Content Section */}
      <div className="contact-main-container">
        <div className="contact-content-wrapper">
          {/* Left Column - Contact Information */}
          <div className="contact-info-column">
            <h2 className="contact-section-title">CONTACT US.</h2>
            
            <div className="contact-info-list">
              {/* Call Us */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">CALL US:</h3>
                  <p className="contact-info-text">Hotline: (+2) 0248813824</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">WhatsApp:</h3>
                  <p className="contact-info-text">WhatsApp (+2) 012 1198 1188</p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">EMAIL ADDRESS:</h3>
                  <p className="contact-info-text">info@techhub-electronics.com</p>
                </div>
              </div>

              {/* Store Location */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">STORE LOCATION:</h3>
                  <p className="contact-info-text">158 Elhorya St., Elibrahymia, Alexandria, Egypt</p>
                </div>
              </div>

              {/* Work Hours */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">WORK HOURS:</h3>
                  <p className="contact-info-text">Saturday - Thursday 10AM - 8:30PM</p>
                  <p className="contact-info-text">Friday 2PM - 8PM</p>
                  <p className="contact-info-text">Customer service working hours Saturday - Thursday 10AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="social-media-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Google Maps */}
          <div className="contact-map-column">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3411.234567890123!2d29.91234567890123!3d31.23456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f62c8b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2s158%20Elhorya%20St%2C%20Elibrahymia%2C%20Alexandria%2C%20Egypt!5e0!3m2!1sen!2seg!4v1699123456789!5m2!1sen!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TechHub Electronics Location - 158 Elhorya St., Elibrahymia, Alexandria, Egypt"
              className="google-map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

