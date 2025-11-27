import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/orders';
import './Checkout.css';

const TAX_RATE = 0.1;
const EXPRESS_SHIPPING_FEE = 25;
const STANDARD_SHIPPING_FEE = 10;
const FREE_SHIPPING_THRESHOLD = 100;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Egypt',
    paymentMethod: 'card',
    shippingMethod: 'standard',
    notes: '',
  });

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems.length, cartLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address?.street || prev.address,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        zip: user.address?.zipCode || prev.zip,
        country: user.address?.country || prev.country,
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);

  const shippingCost = useMemo(() => {
    if (formData.shippingMethod === 'express') {
      return EXPRESS_SHIPPING_FEE;
    }
    if (formData.shippingMethod === 'pickup') {
      return 0;
    }
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [formData.shippingMethod, subtotal]);

  const total = useMemo(() => subtotal + tax + shippingCost, [subtotal, tax, shippingCost]);

  const estimatedDelivery = useMemo(() => {
    switch (formData.shippingMethod) {
      case 'express':
        return 'Arrives in 1-2 business days';
      case 'pickup':
        return 'Ready for pickup within 24 hours';
      default:
        return 'Arrives in 3-5 business days';
    }
  }, [formData.shippingMethod]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cartItems.length) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        shippingAddress: {
          name: formData.name.trim(),
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zip.trim(),
          country: formData.country.trim(),
          phone: formData.phone.trim(),
        },
        paymentMethod:
          formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card',
        note: formData.notes,
      });

      toast.success(`Order ${order.orderNumber} placed successfully`);
      await clearCart();
      navigate('/checkout/success', {
        replace: true,
        state: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          total,
        },
      });
    } catch (error) {
      toast.error(error.message || 'Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="checkout-container">
        <h1 className="page-title">Checkout</h1>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-content">
            <div className="checkout-form-section">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State / Governorate</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zip">ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h2>Shipping Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                  />
                  Standard · {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : `${STANDARD_SHIPPING_FEE} EGP`}
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                  />
                  Express · {EXPRESS_SHIPPING_FEE} EGP
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="pickup"
                    checked={formData.shippingMethod === 'pickup'}
                    onChange={handleChange}
                  />
                  Store Pickup · Free
                </label>
              </div>
              <p className="delivery-note">{estimatedDelivery}</p>

              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  Credit/Debit Card
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  Cash on Delivery
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Delivery instructions, preferred contact time, etc."
                />
              </div>
            </div>

            <div className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="summary-row">
                  <span>Estimated tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                  <span>{tax.toFixed(2)} EGP</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} EGP`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
              </div>
              <p className="updates-note">
                Fulfillment updates will be sent to {formData.email || user?.email}.
              </p>
              <button type="submit" className="place-order-btn" disabled={submitting}>
                {submitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
