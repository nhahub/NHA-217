const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product.name} is no longer available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available`
        });
      }

      // Handle image - can be object {url, alt} or string
      let imageUrl = '';
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        imageUrl = typeof firstImage === 'string' ? firstImage : (firstImage.url || '');
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: imageUrl
      });

      subtotal += product.price * item.quantity;
    }

    // Calculate pricing
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Generate unique order number
    const date = new Date();
    const dateStr = date.getFullYear() +
                    String(date.getMonth() + 1).padStart(2, '0') +
                    String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    const orderNumber = `ORD-${dateStr}-${random}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      },
      notes
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order for response
    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.product', 'name');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user can only see their own orders (unless admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel orders that haven't been shipped
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order that has been ${order.status.toLowerCase()}`
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'Cancelled';
    order.cancelReason = reason || 'Cancelled by user';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: reason || 'Cancelled by user'
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
