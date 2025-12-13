import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService, Product } from '@/services/product';
import { categoryService, Category } from '@/services/category';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



const ProductList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll({ 
          search, 
          category: selectedCategory || undefined,
          sortBy, 
          sortOrder,
          page,
          limit
        });
        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, sortBy, sortOrder, page]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Shop Collection</h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                Discover our premium selection of products.
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto flex-wrap">
              <div className="relative flex-1 md:w-80 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search') || 'Search products...'}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-10 bg-gray-50 dark:bg-gray-900 border-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[140px]">
                    <SlidersHorizontal className="h-4 w-4" />
                    {selectedCategory 
                      ? categories.find(c => c.name === selectedCategory)?.name || 'Category'
                      : 'All Categories'
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => { 
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                    setSelectedCategory('');
                    setPage(1); 
                  }}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.id} 
                      onClick={() => { 
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('category', cat.name);
                        setSearchParams(newParams);
                        setSelectedCategory(cat.name);
                        setPage(1); 
                      }}
                    >
                      {cat.name} ({cat.productCount || 0})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[140px]">
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'price' 
                      ? (sortOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low')
                      : sortBy === 'name'
                        ? (sortOrder === 'asc' ? 'Name: A-Z' : 'Name: Z-A')
                        : 'Newest Arrivals'
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleSort('createdAt', 'desc')}>
                    Newest Arrivals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('price', 'asc')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('price', 'desc')}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('name', 'asc')}>
                    Name: A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('name', 'desc')}>
                    Name: Z-A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any products matching your search. Try adjusting your filters or check back later.
            </p>
            <Button 
              variant="link" 
              className="mt-4 text-primary"
              onClick={() => { 
                setSearch(''); 
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('category');
                setSearchParams(newParams);
                setSelectedCategory('');
                setSortBy('createdAt'); 
                setPage(1);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Active Filters */}
        {(search || selectedCategory) && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {search && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Search: "{search}"
                <button onClick={() => { setSearch(''); setPage(1); }}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Category: {selectedCategory}
                <button onClick={() => { 
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('category');
                  setSearchParams(newParams);
                  setSelectedCategory('');
                  setPage(1); 
                }}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > limit && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <Button 
              variant="outline" 
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
