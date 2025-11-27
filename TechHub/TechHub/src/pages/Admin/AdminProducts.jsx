import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllProducts, deleteProduct, createProduct, uploadProductImages } from '../../api/admin';
import { getProducts } from '../../api/products';
import Modal from '../../components/Modal/Modal';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        ...(search && { search }),
        limit: 100, // Get more products for admin view
      };
      // Try admin API first, fallback to regular products API
      try {
        const productsData = await getAllProducts(params);
        setProducts(productsData);
      } catch (error) {
        // Fallback to regular products API
        const { products: fallbackProducts } = await getProducts(params);
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (files.length + selectedImages.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Image files must be smaller than 5MB');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.category || formData.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.price) < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    if (parseInt(formData.stock) < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setSubmitting(true);
    try {
      // Upload images first
      let imageUrls = [];
      if (selectedImages.length > 0) {
        try {
          const uploadedImages = await uploadProductImages(selectedImages);
          imageUrls = uploadedImages.map(img => ({
            url: img.url,
            alt: img.alt || formData.name
          }));
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          toast.error(uploadError.message || 'Failed to upload images');
          setSubmitting(false);
          return;
        }
      }

      // Create product with image URLs
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        images: imageUrls,
      };

      const newProduct = await createProduct(productData);
      toast.success('Product created successfully');
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        isActive: true,
      });
      setSelectedImages([]);
      setImagePreviews([]);
      // Reload products
      await loadProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product =>
    !search || product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="products-header">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <motion.button 
          className="add-product-btn"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 16px rgba(0, 86, 204, 0.35)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Product
        </motion.button>
      </div>

      {loading ? (
        <div className="table-loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                custom={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="product-card"
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="product-image">
                  <svg className="product-placeholder" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {!product.isActive && <div className="inactive-overlay">Inactive</div>}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-details">
                    <span className="product-price">${product.price}</span>
                    <span className={`product-stock ${product.stock < 10 ? 'low-stock' : ''}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="product-actions">
                    <motion.button 
                      className="action-btn edit-btn"
                      whileHover={{ scale: 1.05, backgroundColor: '#e2e8f0' }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </motion.button>
                    <motion.button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(product._id)}
                      whileHover={{ scale: 1.05, backgroundColor: '#fecaca' }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedImages([]);
          setImagePreviews([]);
        }}
        title="Add New Product"
      >
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Automotive">Automotive</option>
              <option value="Food & Grocery">Food & Grocery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="images">Product Images * (Max 5 images)</label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreviews.length > 0 && (
              <div className="image-preview-container">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedImages.length > 0 && (
              <p className="image-count">
                {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Active (Product will be visible to customers)</span>
            </label>
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-cancel"
              onClick={() => setIsModalOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="btn-submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              {submitting ? 'Creating...' : 'Create Product'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;

