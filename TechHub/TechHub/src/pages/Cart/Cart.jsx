import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
  ];

  if (loading) {
    return (
      <div className="cart-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="cart-container">
          <h1 className="page-title">Shopping Cart</h1>
          <div className="empty-cart">
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="cart-container">
          <h1 className="page-title">Shopping Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="cart-container">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="image-placeholder">📦</div>
                  )}
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{item.price ? `${item.price} EGP` : 'Price unavailable'}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  <p>{item.price ? `${(item.price * item.quantity).toFixed(2)} EGP` : '—'}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{`${getCartTotal().toFixed(2)} EGP`}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{`${getCartTotal().toFixed(2)} EGP`}</span>
              </div>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


