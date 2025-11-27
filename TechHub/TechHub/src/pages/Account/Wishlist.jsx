import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Account.css';

const Wishlist = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Favorites List', path: '/wishlist' },
  ];

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  const getStockStatus = (stock) => {
    if (typeof stock === 'number') {
      return stock > 0 ? 'In stock' : 'Out of stock';
    }
    return 'Check availability';
  };

  const getStockVariant = (stock) => {
    if (typeof stock === 'number') {
      return stock > 0 ? 'badge-success' : 'badge-muted';
    }
    return 'badge-neutral';
  };

  return (
    <div className="wishlist-page">
      <section className="wishlist-hero">
        <div className="wishlist-hero-content">
          <Breadcrumb items={breadcrumbItems} />
          <p className="wishlist-hero-eyebrow">favorites list</p>
          <h1 className="wishlist-hero-title">Favorites List</h1>
          <p className="wishlist-hero-subtitle">
            My favorites products
          </p>
        </div>
      </section>

      <section className="wishlist-section">
        <div className="wishlist-card">
          <div className="wishlist-card-header">
            <h2>My Favorites products</h2>
            {wishlistItems.length > 0 && (
              <p className="wishlist-count">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          <div className="wishlist-table-wrapper">
            <table className="wishlist-table" role="grid">
              <thead>
                <tr>
                  <th scope="col">Product name</th>
                  <th scope="col">Unit price</th>
                  <th scope="col">Stock status</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="wishlist-product">
                          <Link to={`/products/${item.id}`} className="wishlist-product-thumb">
                            {item.image ? (
                              <img src={item.image} alt={item.name} loading="lazy" />
                            ) : (
                              <span className="image-placeholder" aria-hidden="true">📦</span>
                            )}
                          </Link>
                          <div className="wishlist-product-details">
                            <Link to={`/products/${item.id}`} className="wishlist-product-name">
                              {item.name}
                            </Link>
                            <div className="wishlist-product-actions">
                              <button
                                className="wishlist-action-link"
                                onClick={() => handleAddToCart(item)}
                              >
                                Move to cart
                              </button>
                              <button
                                className="wishlist-remove-link"
                                type="button"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="wishlist-price">
                          {item.price ? `${item.price} EGP` : 'Price unavailable'}
                        </p>
                      </td>
                      <td>
                        <span className={`wishlist-badge ${getStockVariant(item.stock)}`}>
                          {getStockStatus(item.stock)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="wishlist-empty">
                      No products added to the wishlist
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;


