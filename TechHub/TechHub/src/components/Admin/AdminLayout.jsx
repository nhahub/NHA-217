import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/admin/orders', 
      label: 'Orders', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9857C9.5799 19.7134 9.31074 19.5012 9 19.37C8.69979 19.2369 8.36564 19.1972 8.04123 19.256C7.71682 19.3148 7.41753 19.4695 7.18 19.7L7.12 19.76C6.93425 19.946 6.71368 20.0935 6.47088 20.1941C6.22808 20.2948 5.96783 20.3466 5.705 20.3466C5.44217 20.3466 5.18192 20.2948 4.93912 20.1941C4.69632 20.0935 4.47575 19.946 4.29 19.76C4.10405 19.5743 3.95653 19.3537 3.85588 19.1109C3.75523 18.8681 3.70343 18.6078 3.70343 18.345C3.70343 18.0822 3.75523 17.8219 3.85588 17.5791C3.95653 17.3363 4.10405 17.1157 4.29 16.93L4.35 16.87C4.58054 16.6325 4.73519 16.3332 4.794 16.0088C4.85282 15.6844 4.81312 15.3498 4.68 15.05C4.54687 14.7502 4.32668 14.498 4.05839 14.3203C3.7901 14.1426 3.47569 14.0473 3.15 14.05H3C2.46957 14.05 1.96086 13.8393 1.58579 13.4642C1.21071 13.0891 1 12.5804 1 12.05C1 11.5196 1.21071 11.0109 1.58579 10.6358C1.96086 10.2607 2.46957 10.05 3 10.05H3.09C3.42099 10.0423 3.742 9.93512 4.0143 9.74251C4.2866 9.5499 4.49881 9.28074 4.63 8.97C4.76312 8.66979 4.80282 8.33564 4.744 8.01123C4.68519 7.68682 4.53054 7.38753 4.3 7.15L4.24 7.09C4.05405 6.90425 3.90653 6.68368 3.80588 6.44088C3.70523 6.19808 3.65343 5.93783 3.65343 5.675C3.65343 5.41217 3.70523 5.15192 3.80588 4.90912C3.90653 4.66632 4.05405 4.44575 4.24 4.26C4.42575 4.07405 4.64632 3.92653 4.88912 3.82588C5.13192 3.72523 5.39217 3.67343 5.655 3.67343C5.91783 3.67343 6.17808 3.72523 6.42088 3.82588C6.66368 3.92653 6.88425 4.07405 7.07 4.26L7.13 4.32C7.36753 4.55054 7.66682 4.70519 7.99123 4.764C8.31564 4.82282 8.64979 4.78312 8.95 4.65H9C9.29926 4.51881 9.56842 4.3066 9.74611 4.0383C9.9238 3.77 10.0191 3.45559 10.02 3.13V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0277 3.42099 14.1349 3.742 14.3275 4.0143C14.5201 4.2866 14.7893 4.49881 15.1 4.63C15.4002 4.76312 15.7344 4.80282 16.0588 4.744C16.3832 4.68519 16.6825 4.53054 16.92 4.3L16.98 4.24C17.1657 4.05405 17.3863 3.90653 17.6291 3.80588C17.8719 3.70523 18.1322 3.65343 18.395 3.65343C18.6578 3.65343 18.9181 3.70523 19.1609 3.80588C19.4037 3.90653 19.6243 4.05405 19.81 4.26C19.996 4.44575 20.1435 4.66632 20.2441 4.90912C20.3448 5.15192 20.3966 5.41217 20.3966 5.675C20.3966 5.93783 20.3448 6.19808 20.2441 6.44088C20.1435 6.68368 19.996 6.90425 19.81 7.09L19.75 7.15C19.5195 7.38753 19.3648 7.68682 19.306 8.01123C19.2472 8.33564 19.2869 8.66979 19.42 8.97V9C19.5512 9.28074 19.7634 9.5499 20.0317 9.74251C20.3 9.93512 20.621 10.0423 20.95 10.05H21C21.5304 10.05 22.0391 10.2607 22.4142 10.6358C22.7893 11.0109 23 11.5196 23 12.05C23 12.5804 22.7893 13.0891 22.4142 13.4642C22.0391 13.8393 21.5304 14.05 21 14.05H20.91C20.579 14.0577 20.258 14.1649 19.9857 14.3575C19.7134 14.5501 19.5012 14.8193 19.37 15.13C19.2369 15.4002 19.1972 15.7344 19.256 16.0588C19.3148 16.3832 19.4695 16.6825 19.7 16.92L19.76 16.98C19.946 17.1657 20.0935 17.3863 20.1941 17.6291C20.2948 17.8719 20.3466 18.1322 20.3466 18.395C20.3466 18.6578 20.2948 18.9181 20.1941 19.1609C20.0935 19.4037 19.946 19.6243 19.76 19.81C19.5743 19.996 19.3537 20.1435 19.1109 20.2441C18.8681 20.3448 18.6078 20.3966 18.345 20.3966C18.0822 20.3966 17.8219 20.3448 17.5791 20.2441C17.3363 20.1435 17.1157 19.996 16.93 19.81L16.87 19.75C16.6325 19.5195 16.3332 19.3648 16.0088 19.306C15.6844 19.2472 15.3498 19.2869 15.05 19.42V19.37C14.7502 19.5031 14.498 19.7233 14.3203 19.9916C14.1426 20.2599 14.0473 20.5743 14.05 20.9V21C14.05 21.5304 13.8393 22.0391 13.4642 22.4142C13.0891 22.7893 12.5804 23 12.05 23C11.5196 23 11.0109 22.7893 10.6358 22.4142C10.2607 22.0391 10.05 21.5304 10.05 21V20.91C10.0423 20.579 9.93512 20.258 9.74251 19.9857C9.5499 19.7134 9.28074 19.5012 9 19.37C8.66979 19.2369 8.33564 19.1972 8.01123 19.256C7.68682 19.3148 7.38753 19.4695 7.15 19.7L7.09 19.76C6.90425 19.946 6.68368 20.0935 6.44088 20.1941C6.19808 20.2948 5.93783 20.3466 5.675 20.3466C5.41217 20.3466 5.15192 20.2948 4.90912 20.1941C4.66632 20.0935 4.44575 19.946 4.26 19.76C4.07405 19.5743 3.92653 19.3537 3.82588 19.1109C3.72523 18.8681 3.67343 18.6078 3.67343 18.345C3.67343 18.0822 3.72523 17.8219 3.82588 17.5791C3.92653 17.3363 4.07405 17.1157 4.26 16.93L4.32 16.87C4.55054 16.6325 4.70519 16.3332 4.764 16.0088C4.82282 15.6844 4.78312 15.3498 4.65 15.05H4.6C4.46881 14.7502 4.2566 14.4811 3.9883 14.3034C3.72 14.1257 3.40559 14.0304 3.08 14.03V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: {
      width: 260,
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    closed: {
      width: 80,
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    mobile: {
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    mobileClosed: {
      x: '-100%',
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    open: {
      marginLeft: 260,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    closed: {
      marginLeft: 80,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    mobile: {
      marginLeft: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="admin-layout">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="admin-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        variants={sidebarVariants}
        animate={
          isMobile
            ? mobileMenuOpen
              ? 'mobile'
              : 'mobileClosed'
            : sidebarOpen
            ? 'open'
            : 'closed'
        }
        initial={
          isMobile
            ? 'mobileClosed'
            : sidebarOpen
            ? 'open'
            : 'closed'
        }
      >
        <div className="sidebar-header">
          <motion.button
            className="sidebar-toggle"
            onClick={() => {
              if (isMobile) {
                setMobileMenuOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isMobile ? (
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </motion.button>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.h2
                className="sidebar-logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Admin Panel
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <motion.div
                    className="nav-icon"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {item.icon}
                  </motion.div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      className="nav-label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="nav-indicator"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="admin-main"
        variants={contentVariants}
        animate={
          isMobile
            ? 'mobile'
            : sidebarOpen
            ? 'open'
            : 'closed'
        }
        initial={
          isMobile
            ? 'mobile'
            : sidebarOpen
            ? 'open'
            : 'closed'
        }
      >
        {/* Top Navigation */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h1 className="page-title">
              {menuItems.find(item => 
                location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path))
              )?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <div className="header-profile">
              <motion.button
                className="profile-button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="profile-name">{user?.name || 'Admin'}</span>
                <motion.svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </motion.button>
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    className="profile-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Link to="/profile" className="profile-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Profile
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Link to="/dashboard" className="profile-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        User Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <motion.button 
                        className="profile-menu-item" 
                        onClick={handleLogout}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;

