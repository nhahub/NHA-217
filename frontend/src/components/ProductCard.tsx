import { Product } from '@/services/product';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { hasItem, toggleItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);
  
  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isOnSale = product.salePrice && (!product.saleEndDate || new Date(product.saleEndDate) > new Date());
  const currentPrice = isOnSale ? Number(product.salePrice) : Number(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity: 1,
      image: product.images?.[0]
    });
    
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      style={{ 
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        {product.images && product.images.length > 0 ? (
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 animate-pulse">
            Limited Time
          </div>
        )}
        
        {/* Overlay Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </motion.div>

          <Link to={`/products/${product.id}`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                <Eye className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Wishlist Button - Top Right */}
        <motion.div 
          className="absolute top-3 right-3 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            size="icon" 
            variant="secondary" 
            className={`rounded-full shadow-lg h-8 w-8 transition-colors ${isWishlisted ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500'}`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <motion.span 
            className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full inline-block"
            whileHover={{ scale: 1.05 }}
          >
            {product.category?.name || 'Collection'}
          </motion.span>
        </div>
        <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-white">
          <Link to={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <motion.span 
              className={`font-bold text-xl ${isOnSale ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ${currentPrice.toFixed(2)}
            </motion.span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <motion.span 
              className="text-xs text-green-600 dark:text-green-400 relative overflow-hidden"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              In Stock
            </motion.span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400">Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
