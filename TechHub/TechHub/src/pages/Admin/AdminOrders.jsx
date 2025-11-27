import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus, getAdminOrderById } from '../../api/admin';
import Modal from '../../components/Modal/Modal';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import { downloadInvoice } from '../../utils/invoice';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      };
      const result = await getAllOrders(params);
      setOrders(result.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openOrderDetails = async (orderId) => {
    setModalOpen(true);
    setDetailsLoading(true);
    try {
      const orderDetails = await getAdminOrderById(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error(error);
      setModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.user.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="admin-orders">
      <div className="orders-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="table-loading">Loading orders...</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    custom={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.04, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="table-row"
                    whileHover={{ backgroundColor: '#f8fafc' }}
                  >
                    <td>
                      <span className="order-number">{order.orderNumber}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.user.name}</span>
                        <span className="customer-email">{order.user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="items-count">{order.items.length} items</span>
                    </td>
                    <td>
                      <span className="order-total">${order.pricing.total}</span>
                    </td>
                    <td>
                      <motion.select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`status-select status-${order.status.toLowerCase()}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </motion.select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <motion.button
                        className="view-order-btn"
                        title="View details"
                        onClick={() => openOrderDetails(order._id)}
                        whileHover={{ scale: 1.1, backgroundColor: '#e2e8f0' }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : 'Order details'}
      >
        {detailsLoading ? (
          <div className="table-loading">Loading order...</div>
        ) : (
          <OrderDetails
            order={selectedOrder}
            variant="admin"
            onDownloadInvoice={(order) => downloadInvoice(order)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;

