import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Account.css';

const Dashboard = () => {
  const { user } = useAuth();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <div className="account-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="account-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome, {user?.name || 'User'}!</h2>
            <p>Manage your account and orders from here.</p>
          </div>
          <div className="dashboard-grid">
            <Link to="/orders" className="dashboard-card">
              <h3>My Orders</h3>
              <p>View and track your orders</p>
            </Link>
            <Link to="/wishlist" className="dashboard-card">
              <h3>Wishlist</h3>
              <p>Your saved items</p>
            </Link>
            <Link to="/profile" className="dashboard-card">
              <h3>Profile</h3>
              <p>Update your personal information</p>
            </Link>
            <Link to="/addresses" className="dashboard-card">
              <h3>Addresses</h3>
              <p>Manage your shipping addresses</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





