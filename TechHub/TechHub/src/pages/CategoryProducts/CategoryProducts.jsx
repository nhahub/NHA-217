import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../api/products';
import { getCategoryBySlug } from '../../api/categories';
import { useCart } from '../../context/CartContext';
import './CategoryProducts.css';

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

const CategoryProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadCategory = async () => {
      setCategoryLoading(true);
      try {
        const categoryData = await getCategoryBySlug(slug);
        if (!categoryData) {
          // Category not found, redirect to 404 or categories page
          navigate('/categories');
          return;
        }
        setCategory(categoryData);
      } catch (error) {
        console.error('Error loading category:', error);
        navigate('/categories');
      } finally {
        setCategoryLoading(false);
      }
    };
    
    if (slug) {
      loadCategory();
    }
  }, [slug, navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!category) return;
      
      setLoading(true);
      try {
        const response = await getProducts({
          category: category.name,
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
  }, [category, sortBy, itemsPerPage, currentPage]);

  const breadcrumbItems = useMemo(() => [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: category?.name || 'Category', path: category ? `/categories/${slug}` : '#' },
  ], [category, slug]);

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

  if (categoryLoading) {
    return (
      <div className="category-products-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="category-products-container">
          <Loader />
        </div>
      </div>
    );
  }

  if (!category) {
    return null; // Will redirect
  }

  const showingCount = products.length;

  return (
    <div className="category-products-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="category-products-container">
        <div className="category-header">
          <h1 className="page-title">{category.name}</h1>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
        </div>

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
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))
              ) : (
                <p className="no-products">No products found in this category.</p>
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
  );
};

export default CategoryProducts;


