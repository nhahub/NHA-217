import { useEffect, useState } from 'react';
import { orderService, Order } from '@/services/order';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle;
      case 'PENDING': return Clock;
      case 'CANCELLED': return XCircle;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500">Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Order #{order.id.slice(0, 8)}</div>
                      <div className="font-bold text-lg">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">{order.status}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {/* Placeholder for item image if available in order items */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.product?.name || 'Product'}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-bold">${Number(item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="font-medium text-gray-500">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">${Number(order.total).toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
