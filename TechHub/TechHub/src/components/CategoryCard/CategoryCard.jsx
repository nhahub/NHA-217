import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="category-card">
      <div className="category-icon">{category.icon}</div>
      <div className="category-label">{category.name}</div>
    </Link>
  );
};

export default CategoryCard;





