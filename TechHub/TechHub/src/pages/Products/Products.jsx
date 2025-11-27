import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../api/products';
import { getCategories } from '../../api/categories';
import { useCart } from '../../context/CartContext';
import './Products.css';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const sortMap = {
  'newest': 'newest',
  'price-low': 'price_asc',
  'price-high': 'price_desc',
  'name-asc': 'name_asc',
  'name-desc': 'name_desc',
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({
          category: selectedCategory,
          sort: sortMap[sortBy],
          page: currentPage,
          limit: itemsPerPage,
        });
        setProducts(response.products);
        setMeta({
          total: response.total,
          page: response.page,
          pages: response.pages,
        });
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setMeta({ total: 0, page: 1, pages: 1 });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, sortBy, itemsPerPage, currentPage]);

  const breadcrumbItems = useMemo(() => ([
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ]), []);

  const handleCategorySelect = (categoryName) => {
    setCurrentPage(1);
    setSelectedCategory((prev) => (prev === categoryName ? '' : categoryName));
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev') {
        return Math.max(1, prev - 1);
      }
      if (direction === 'next') {
        return Math.min(meta.pages, prev + 1);
      }
      return prev;
    });
  };

  const categoryList = categoriesLoading ? [] : categories;
  const showingCount = products.length;

  return (
    <div className="products-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="products-container">
        <div className="products-layout">
          <motion.aside 
            className="categories-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="categories-title">Categories</h2>
            {categoriesLoading ? (
              <Loader />
            ) : (
              <div className="categories-list">
                {categoryList.length === 0 ? (
                  <p>No categories found.</p>
                ) : (
                  categoryList.map((category, index) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      className={`category-pill ${selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(category.name)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                    </motion.button>
                  ))
                )}
              </div>
            )}
          </motion.aside>

          <div className="products-main">
            <div className="products-controls">
              <div className="control-group">
                <label htmlFor="sort-select">Sort by</label>
                <select
                  id="sort-select"
                  className="control-select"
                  value={sortBy}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSortBy(e.target.value);
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="show-select">Show</label>
                <select
                  id="show-select"
                  className="control-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setItemsPerPage(Number(e.target.value));
                  }}
                >
                  {[12, 24, 36, 48].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="results-count">
                Showing {showingCount} of {meta.total} products
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="products-grid">
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={() => addToCart(product)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.p 
                      className="no-products"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No products found.
                    </motion.p>
                  )}
                </div>
                {meta.pages > 1 && (
                  <div className="pagination-controls">
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => handlePageChange('prev')}
                      disabled={meta.page === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {meta.page} of {meta.pages}
                    </span>
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => handlePageChange('next')}
                      disabled={meta.page === meta.pages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

