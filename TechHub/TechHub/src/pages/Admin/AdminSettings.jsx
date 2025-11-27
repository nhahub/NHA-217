import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'TechHub Electronics',
    siteEmail: 'admin@techhub-electronics.com',
    maintenanceMode: false,
    allowRegistrations: true,
    orderAutoConfirm: false,
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="admin-settings">
      <motion.div
        className="settings-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      >
        <h3 className="card-title">General Settings</h3>
        <div className="settings-form">
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
            />
          </motion.div>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <label>Site Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => handleChange('siteEmail', e.target.value)}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="settings-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      >
        <h3 className="card-title">System Settings</h3>
        <div className="settings-form">
          <div className="toggle-group">
            <motion.div 
              className="toggle-item"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="toggle-info">
                <label>Maintenance Mode</label>
                <p>Enable to put the site in maintenance mode</p>
              </div>
              <motion.label 
                className="toggle-switch"
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <motion.span 
                  className="toggle-slider"
                  animate={{
                    backgroundColor: settings.maintenanceMode ? '#0056CC' : '#cbd5e1'
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.label>
            </motion.div>
            <motion.div 
              className="toggle-item"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="toggle-info">
                <label>Allow Registrations</label>
                <p>Allow new users to register</p>
              </div>
              <motion.label 
                className="toggle-switch"
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={settings.allowRegistrations}
                  onChange={(e) => handleChange('allowRegistrations', e.target.checked)}
                />
                <motion.span 
                  className="toggle-slider"
                  animate={{
                    backgroundColor: settings.allowRegistrations ? '#0056CC' : '#cbd5e1'
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.label>
            </motion.div>
            <motion.div 
              className="toggle-item"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="toggle-info">
                <label>Auto Confirm Orders</label>
                <p>Automatically confirm new orders</p>
              </div>
              <motion.label 
                className="toggle-switch"
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={settings.orderAutoConfirm}
                  onChange={(e) => handleChange('orderAutoConfirm', e.target.checked)}
                />
                <motion.span 
                  className="toggle-slider"
                  animate={{
                    backgroundColor: settings.orderAutoConfirm ? '#0056CC' : '#cbd5e1'
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.label>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="settings-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.button 
          className="save-btn" 
          onClick={handleSave}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 16px rgba(0, 86, 204, 0.35)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Save Settings
        </motion.button>
        <motion.button 
          className="cancel-btn"
          whileHover={{ scale: 1.02, backgroundColor: '#e2e8f0' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Cancel
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminSettings;


