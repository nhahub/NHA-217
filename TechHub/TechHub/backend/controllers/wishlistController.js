const User = require('../models/User');
const Product = require('../models/Product');

const formatWishlistProduct = (product) => ({
  id: product._id,
  _id: product._id,
  name: product.name,
  price: product.price,
  images: product.images || [],
  image: product.images?.[0] || null,
  stock: product.stock,
  category: product.category,
  description: product.description,
});

const respondWithWishlist = async (userId, res) => {
  const user = await User.findById(userId).populate('wishlist');
  const items = (user?.wishlist || []).filter(Boolean).map(formatWishlistProduct);

  res.status(200).json({
    success: true,
    data: items,
  });
};

exports.getWishlist = async (req, res, next) => {
  try {
    await respondWithWishlist(req.user.id, res);
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive',
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } },
      { new: true },
    );

    await respondWithWishlist(req.user.id, res);
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: id } },
      { new: true },
    );

    await respondWithWishlist(req.user.id, res);
  } catch (error) {
    next(error);
  }
};

exports.syncWishlist = async (req, res, next) => {
  try {
    const { productIds = [] } = req.body;
    const uniqueIds = [...new Set(productIds)];

    if (!uniqueIds.length) {
      await User.findByIdAndUpdate(req.user.id, { wishlist: [] });
      await respondWithWishlist(req.user.id, res);
      return;
    }

    const validProducts = await Product.find({
      _id: { $in: uniqueIds },
      isActive: { $ne: false },
    }).select('_id');

    const sanitizedIds = validProducts.map((product) => product._id);

    await User.findByIdAndUpdate(req.user.id, { wishlist: sanitizedIds });
    await respondWithWishlist(req.user.id, res);
  } catch (error) {
    next(error);
  }
};


