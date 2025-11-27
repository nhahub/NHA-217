const SpecialOrder = require('../models/SpecialOrder');

exports.createSpecialOrder = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      products,
      notes
    } = req.body;

    if (!firstName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    const sanitizedProducts = (products || [])
      .filter(product => product?.name?.trim())
      .map(product => ({
        name: product.name.trim(),
        quantity: product.quantity || 1,
        targetPrice: product.targetPrice,
        referenceUrl: product.referenceUrl
      }));

    if (sanitizedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product is required'
      });
    }

    const specialOrder = await SpecialOrder.create({
      firstName: firstName.trim(),
      lastName: lastName?.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      products: sanitizedProducts,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Special order submitted successfully',
      data: specialOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all special orders (Admin)
 * @route   GET /api/admin/special-orders
 * @access  Private/Admin
 */
exports.getAllSpecialOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const specialOrders = await SpecialOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await SpecialOrder.countDocuments(query);

    res.status(200).json({
      success: true,
      count: specialOrders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: specialOrders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single special order (Admin)
 * @route   GET /api/admin/special-orders/:id
 * @access  Private/Admin
 */
exports.getSpecialOrder = async (req, res, next) => {
  try {
    const specialOrder = await SpecialOrder.findById(req.params.id);

    if (!specialOrder) {
      return res.status(404).json({
        success: false,
        message: 'Special order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: specialOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update special order status (Admin)
 * @route   PUT /api/admin/special-orders/:id/status
 * @access  Private/Admin
 */
exports.updateSpecialOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const specialOrder = await SpecialOrder.findById(req.params.id);

    if (!specialOrder) {
      return res.status(404).json({
        success: false,
        message: 'Special order not found'
      });
    }

    const oldStatus = specialOrder.status;
    specialOrder.status = status;
    specialOrder.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated from ${oldStatus} to ${status}`
    });

    await specialOrder.save();

    res.status(200).json({
      success: true,
      message: 'Special order status updated successfully',
      data: specialOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete special order (Admin)
 * @route   DELETE /api/admin/special-orders/:id
 * @access  Private/Admin
 */
exports.deleteSpecialOrder = async (req, res, next) => {
  try {
    const specialOrder = await SpecialOrder.findById(req.params.id);

    if (!specialOrder) {
      return res.status(404).json({
        success: false,
        message: 'Special order not found'
      });
    }

    await SpecialOrder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Special order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




