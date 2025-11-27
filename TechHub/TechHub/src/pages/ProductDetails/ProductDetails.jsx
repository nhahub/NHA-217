import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import { getProductById } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const breadcrumbItems = useMemo(() => ([
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: product?.name || 'Product', path: `/products/${id}` },
  ]), [id, product?.name]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success('Added to cart');
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="product-details-container">
          <p>Product not found.</p>
          <Link to="/products" className="add-to-cart-btn-large">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[0] || product.image;
  const wishlistActive = isInWishlist(product.id);

  return (
    <div className="product-details">
      <Breadcrumb items={breadcrumbItems} />
      <div className="product-details-container">
        <div className="product-image-section">
          <div className="main-image">
            {mainImage ? (
              <img src={mainImage} alt={product.name} />
            ) : (
              <div className="image-placeholder-large">📦</div>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price-section">
            <span className="current-price">
              {product.price ? `${product.price} EGP` : 'Price unavailable'}
            </span>
            {!product.inStock && <span className="out-of-stock-badge">Out of Stock</span>}
          </div>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          <div className="product-actions">
            <div className="quantity-selector">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((prev) => prev + 1)}>
                +
              </button>
            </div>
            <button
              className="add-to-cart-btn-large"
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Unavailable'}
            </button>
            <button
              type="button"
              className={`wishlist-btn ${wishlistActive ? 'active' : ''}`}
              onClick={handleAddToWishlist}
            >
              {wishlistActive ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="product-meta">
            <p><strong>Category:</strong> {product.category || 'N/A'}</p>
            <p><strong>Stock:</strong> {product.inStock ? `${product.stock} available` : 'Out of stock'}</p>
            <p><strong>SKU:</strong> {product.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

