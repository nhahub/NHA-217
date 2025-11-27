import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import { getProducts, getCategories } from '../../api/products';
import { useCart } from '../../context/CartContext';
import './Search.css';

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

const Search = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hasQuery = query.length > 0;

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const list = await getCategories();
        setCategories(list);
      } catch (error) {
        toast.error(error.message || 'Unable to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, inStockOnly]);

  useEffect(() => {
    if (!hasQuery) {
      setProducts([]);
      setMeta({ total: 0, page: 1, pages: 1 });
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({
          search: query,
          category: selectedCategory || undefined,
          sort: sortMap[sortBy],
          page: currentPage,
          limit: 12,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          inStock: inStockOnly ? 'true' : undefined,
        });

        if (!controller.signal.aborted) {
          setProducts(response.products);
          setMeta({
            total: response.total,
            page: response.page,
            pages: response.pages,
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setProducts([]);
          setMeta({ total: 0, page: 1, pages: 1 });
          toast.error(error.message || 'Unable to fetch products');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [query, sortBy, selectedCategory, minPrice, maxPrice, inStockOnly, currentPage, hasQuery]);

  const summaryText = useMemo(() => {
    if (!hasQuery) return 'Start by searching for a product name, SKU, or category.';
    if (loading) return `Searching for “${query}”…`;
    if (!products.length) {
      return `No matches for “${query}”. Try adjusting the filters or using a different keyword.`;
    }
    return `Showing ${products.length} of ${meta.total} result${meta.total === 1 ? '' : 's'} for “${query}”.`;
  }, [hasQuery, loading, products.length, meta.total, query]);

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

  return (
    <div className="search-page">
      <div className="search-hero">
        <p className="search-eyebrow">Search</p>
        <h1>Find components, tools, and devices faster</h1>
        <p>{summaryText}</p>
      </div>

      <div className="search-layout">
        <aside className="search-sidebar">
          <div className="filter-card">
            <h3>Filter results</h3>

            <label className="filter-field">
              <span>Category</span>
              {categoriesLoading ? (
                <div className="filter-loader">
                  <Loader />
                </div>
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <div className="filter-field grid">
              <label>
                <span>Min price</span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                <span>Max price</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="1000"
                />
              </label>
            </div>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
              />
              <span>Only show items in stock</span>
            </label>

            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSelectedCategory('');
                setMinPrice('');
                setMaxPrice('');
                setInStockOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
        </aside>

        <section className="search-results">
          <div className="search-controls">
            <div className="search-meta">
              <span className="badge-secondary">
                {meta.total} result{meta.total === 1 ? '' : 's'}
              </span>
              {hasQuery && (
                <p className="meta-hint">
                  Search term: <strong>“{query}”</strong>
                </p>
              )}
            </div>
            <label className="sort-field">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => {
                  setCurrentPage(1);
                  setSortBy(event.target.value);
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!hasQuery ? (
            <div className="search-empty">
              <p>Type a keyword in the search bar to get started.</p>
            </div>
          ) : loading ? (
            <div className="search-loader">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="search-empty">
              <p>No matches for “{query}”. Try removing filters or using a broader term.</p>
            </div>
          ) : (
            <>
              <div className="search-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              {meta.pages > 1 && (
                <div className="pagination-controls">
                  <button
                    type="button"
                    onClick={() => handlePageChange('prev')}
                    disabled={meta.page === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {meta.page} of {meta.pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageChange('next')}
                    disabled={meta.page === meta.pages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Search;


