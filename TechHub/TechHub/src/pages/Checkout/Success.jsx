import { Link, useLocation } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          {orderNumber ? (
            <>
              <p className="success-message">
                Thank you for your purchase. We&apos;ve started preparing order{' '}
                <strong>{orderNumber}</strong>.
              </p>
              <p className="success-info">
                Total paid: <strong>{total?.toFixed ? `${total.toFixed(2)} EGP` : '—'}</strong>. A confirmation email is on the way with tracking updates.
              </p>
            </>
          ) : (
            <p className="success-message">
              Your order is confirmed and will appear in your account shortly.
            </p>
          )}
          <div className="success-actions">
            <Link to="/orders" className="view-orders-btn">
              View My Orders
            </Link>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
