import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { productService, Product } from '@/services/product';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real app, we should have an endpoint to get products by IDs
        // For now, we'll fetch all and filter, or fetch individually
        const allProducts = await productService.getAll({ limit: 1000 });
        const wishlistProducts = allProducts.products.filter(p => items.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to fetch wishlist products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} items saved</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="h-24 w-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Start saving your favorite items by clicking the heart icon on products you love.
            </p>
            <Link to="/products">
              <Button size="lg" className="rounded-full px-8">
                Explore Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
