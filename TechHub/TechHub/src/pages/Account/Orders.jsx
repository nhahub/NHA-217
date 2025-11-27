import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Modal from '../../components/Modal/Modal';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import { getUserOrders, getOrder } from '../../api/orders';
import { downloadInvoice } from '../../utils/invoice';
import './Account.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const breadcrumbItems = useMemo(() => ([
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Orders', path: '/orders' },
  ]), []);

  const loadOrders = async (showToast = false) => {
    if (showToast) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await getUserOrders();
      setOrders(result.orders || []);
      if (showToast) {
        toast.success('Orders refreshed');
      }
    } catch (error) {
      setOrders([]);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      if (showToast) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openOrderDetails = async (orderId) => {
    setModalOpen(true);
    setDetailsLoading(true);
    try {
      const orderDetails = await getOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      toast.error(error.message || 'Failed to load order details');
      setModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(value);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading your orders...</div>;
    }

    if (!orders.length) {
      return (
        <div className="empty-state">
          <p>You don&apos;t have any orders yet.</p>
          <button className="view-order-btn" onClick={() => loadOrders(true)} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      );
    }

    return orders.map((order) => (
      <div key={order._id} className="order-card">
        <div className="order-header">
          <div>
            <h3>{order.orderNumber}</h3>
            <p className="order-date">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={`order-status status-${order.status?.toLowerCase()}`}>
            {order.status}
          </div>
        </div>
        <div className="order-items">
          <p>
            <strong>Items:</strong>{' '}
            {order.items?.map((item) => item.name).join(', ') || 'Not available'}
          </p>
        </div>
        <div className="order-footer">
          <p className="order-total">
            Total: {formatCurrency(order.pricing?.total)}
          </p>
          <button
            className="view-order-btn"
            type="button"
            onClick={() => openOrderDetails(order._id)}
          >
            View Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="account-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="account-container">
        <div className="orders-header">
          <h1 className="page-title">My Orders</h1>
          {orders.length > 0 && (
            <button
              className="view-order-btn"
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
        <div className="orders-list">{renderContent()}</div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : 'Order details'}
      >
        {detailsLoading ? (
          <div className="loading">Loading order...</div>
        ) : (
          <OrderDetails
            order={selectedOrder}
            onDownloadInvoice={(order) => downloadInvoice(order)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;

