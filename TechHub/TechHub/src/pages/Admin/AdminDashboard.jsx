import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../api/admin';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to empty stats on error
        setStats({
          overview: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
          ordersByStatus: [],
          recentOrders: [],
          lowStockProducts: [],
          bestSellingProducts: [],
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const kpiCards = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#0056CC',
      change: '+12%',
    },
    {
      title: 'Total Products',
      value: stats?.overview?.totalProducts || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#06A77D',
      change: '+5%',
    },
    {
      title: 'Total Orders',
      value: stats?.overview?.totalOrders || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#FF9500',
      change: '+18%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.overview?.totalRevenue?.toLocaleString() || 0}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M17 5H9.5C8.57174 5 8.17653 5.33679 8.17653 5.75C8.17653 6.16321 8.57174 6.5 9.5 6.5H14.5C15.4283 6.5 15.8235 6.83679 15.8235 7.25C15.8235 7.66321 15.4283 8 14.5 8H9.5C8.57174 8 8.17653 8.33679 8.17653 8.75C8.17653 9.16321 8.57174 9.5 9.5 9.5H14.5C15.4283 9.5 15.8235 9.83679 15.8235 10.25C15.8235 10.6632 15.4283 11 14.5 11H9.5C8.57174 11 8.17653 11.3368 8.17653 11.75C8.17653 12.1632 8.57174 12.5 9.5 12.5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#E63946',
      change: '+24%',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    hover: {
      y: -6,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="kpi-card"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="kpi-content">
              <h3 className="kpi-title">{card.title}</h3>
              <p className="kpi-value">{card.value}</p>
              <span className="kpi-change" style={{ color: card.color }}>
                {card.change} from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="dashboard-grid">
        {/* Orders by Status */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
        >
          <h3 className="card-title">Orders by Status</h3>
          <div className="orders-status-list">
            {stats?.ordersByStatus?.map((status) => (
              <div key={status._id} className="status-item">
                <div className="status-header">
                  <span className="status-name">{status._id}</span>
                  <span className="status-count">{status.count}</span>
                </div>
                <div className="status-bar">
                  <motion.div
                    className="status-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(status.count / 150) * 100}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    style={{ background: getStatusColor(status._id) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
        >
          <h3 className="card-title">Recent Orders</h3>
          <div className="recent-orders-list">
            {stats?.recentOrders?.map((order, index) => (
              <motion.div
                key={order.orderNumber}
                className="recent-order-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ x: 4, backgroundColor: '#f1f5f9' }}
              >
                <div className="order-info">
                  <span className="order-number">{order.orderNumber}</span>
                  <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <span className="order-amount">${order.pricing?.total || 0}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
        >
          <h3 className="card-title">Low Stock Alert</h3>
          <div className="low-stock-list">
            {stats?.lowStockProducts?.map((product, index) => (
              <motion.div
                key={product.name}
                className="low-stock-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ x: 4, scale: 1.01 }}
              >
                <div className="stock-info">
                  <span className="stock-name">{product.name}</span>
                  <span className="stock-category">{product.category}</span>
                </div>
                <span className="stock-count">{product.stock} left</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Best Selling Products */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
        >
          <h3 className="card-title">Best Selling Products</h3>
          <div className="best-selling-list">
            {stats?.bestSellingProducts?.map((product, index) => (
              <motion.div
                key={product.name}
                className="best-selling-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ x: 4, backgroundColor: '#f1f5f9' }}
              >
                <div className="selling-info">
                  <span className="selling-name">{product.name}</span>
                  <span className="selling-sold">{product.totalSold} sold</span>
                </div>
                <span className="selling-revenue">${product.revenue?.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    Placed: '#0056CC',
    Processing: '#FF9500',
    Shipped: '#06A77D',
    Delivered: '#4ECDC4',
    Cancelled: '#E63946',
  };
  return colors[status] || '#64748b';
};

export default AdminDashboard;

