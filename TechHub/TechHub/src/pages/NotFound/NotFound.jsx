import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <p className="not-found-tagline">404 error</p>
        <h1>We couldn&apos;t find that page</h1>
        <p>
          The page you&apos;re looking for no longer exists or might have been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Go home
          </Link>
          <Link to="/products" className="not-found-secondary">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


