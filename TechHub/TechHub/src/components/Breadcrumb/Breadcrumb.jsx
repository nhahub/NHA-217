import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index < items.length - 1 ? (
            <>
              <Link to={item.path}>{item.label}</Link>
              <span className="breadcrumb-separator">/</span>
            </>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;





