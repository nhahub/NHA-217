import './OrderDetails.css';

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0.00 EGP';
  return `${value.toFixed(2)} EGP`;
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrderDetails = ({ order, variant = 'customer', onDownloadInvoice }) => {
  if (!order) return null;

  const timeline = [...(order.statusHistory || [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  return (
    <div className="order-details">
      <header className="order-details__header">
        <div>
          <p className="order-details__number">Order {order.orderNumber}</p>
          <p className="order-details__date">Placed {formatDate(order.createdAt)}</p>
        </div>
        <span className={`order-details__status status-${order.status?.toLowerCase()}`}>
          {order.status}
        </span>
      </header>

      {variant === 'admin' && order.user && (
        <section className="order-details__section">
          <h3>Customer</h3>
          <p>{order.user.name}</p>
          <p>{order.user.email}</p>
          {order.user.phone && <p>{order.user.phone}</p>}
        </section>
      )}

      <section className="order-details__section">
        <h3>Shipping</h3>
        <p>{order.shippingAddress?.name}</p>
        <p>{order.shippingAddress?.street}</p>
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
          {order.shippingAddress?.zipCode}
        </p>
        <p>{order.shippingAddress?.country}</p>
        <p>{order.shippingAddress?.phone}</p>
      </section>

      <section className="order-details__section">
        <h3>Items</h3>
        <ul className="order-details__items">
          {order.items?.map((item) => (
            <li key={item.product?._id || item.product || item.name}>
              <div>
                <p>{item.name}</p>
                <small>Qty {item.quantity}</small>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="order-details__section">
        <h3>Payment summary</h3>
        <div className="order-details__summary">
          <div>
            <span>Subtotal</span>
            <span>{formatCurrency(order.pricing?.subtotal)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>{formatCurrency(order.pricing?.tax)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{formatCurrency(order.pricing?.shipping)}</span>
          </div>
          <div className="order-details__summary-total">
            <span>Total</span>
            <span>{formatCurrency(order.pricing?.total)}</span>
          </div>
        </div>
      </section>

      <section className="order-details__section">
        <h3>Status history</h3>
        <ol className="order-details__timeline">
          {timeline.map((entry, index) => (
            <li key={`${entry.status}-${entry.timestamp}-${index}`}>
              <div className="timeline-point" />
              <div>
                <p className="timeline-status">{entry.status}</p>
                <p className="timeline-date">{formatDate(entry.timestamp)}</p>
                {entry.note && <p className="timeline-note">{entry.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {order.notes && (
        <section className="order-details__section">
          <h3>Notes</h3>
          <p className="order-details__notes">{order.notes}</p>
        </section>
      )}

      <footer className="order-details__footer">
        <button
          type="button"
          className="order-details__invoice-btn"
          onClick={() => onDownloadInvoice?.(order)}
        >
          Download invoice
        </button>
      </footer>
    </div>
  );
};

export default OrderDetails;


