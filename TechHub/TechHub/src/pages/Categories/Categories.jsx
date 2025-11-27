import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { getCategories } from '../../api/categories';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="categories-page">
      <div className="categories-container">
        <h1 className="page-title">PRODUCTS CATEGORIES</h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="category-card"
              >
                <div className="category-image">
                  <div className="image-placeholder">
                    {category.name.charAt(0)}
                  </div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">
                    {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

