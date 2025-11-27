import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const priceLabel = product.price ? `${product.price} EGP` : 'Price unavailable';

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/products/${product.id}`} className="product-link">
        <motion.div 
          className="product-image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {product.isNew && (
            <motion.span 
              className="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              New
            </motion.span>
          )}
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" />
          ) : (
            <div className="image-placeholder">📦</div>
          )}
        </motion.div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-section">
            <p className="product-price">{priceLabel}</p>
          </div>
        </div>
      </Link>
      {onAddToCart && (
        <motion.button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add to Cart
        </motion.button>
      )}
    </motion.div>
  );
};

export default ProductCard;

