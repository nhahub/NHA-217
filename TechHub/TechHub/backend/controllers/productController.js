const Product = require('../models/Product');

/**
 * @desc    Get all products with search, filter, sort, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
      inStock
    } = req.query;

    const query = {};
    if (req.query.includeInactive !== 'true') {
      query.isActive = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories/list
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categoriesWithCounts = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format categories with slug and metadata
    const categories = categoriesWithCounts.map(cat => {
      const name = cat._id;
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      
      return {
        _id: cat._id,
        id: cat._id,
        name: name,
        slug: slug,
        productCount: cat.productCount,
        image: `/api/placeholder/400/300?text=${encodeURIComponent(name)}`,
        description: `Browse our collection of ${name} products`
      };
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured/list
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    // Add the user who created the product
    req.body.createdBy = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated images from GridFS
    if (product.images && product.images.length > 0) {
      const { deleteFiles } = require('../utils/gridfs');
      const ImageMapping = require('../models/ImageMapping');
      
      // Extract file IDs from image URLs
      const imagePromises = product.images.map(async (image) => {
        if (image.url) {
          // Extract filename from URL
          const filename = image.url.split('/').pop();
          
          const mapping = await ImageMapping.findOne({ filename });
          if (mapping) {
            await deleteFiles([mapping.gridfsFileId]);
            await ImageMapping.deleteOne({ _id: mapping._id });
          }
        }
      });
      
      await Promise.all(imagePromises);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
