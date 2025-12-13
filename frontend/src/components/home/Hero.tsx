import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Hero = () => {
  const { user } = useAuthStore();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-32 md:pt-32 md:pb-48">
      {/* Background Blobs with enhanced animation */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none"
      >
        <motion.div 
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-3xl" 
        />
      </motion.div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span 
            variants={staggerItem}
            className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            New Collection 2025
          </motion.span>

          <motion.h1 
            variants={staggerItem}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
          >
            Discover Your Shine <br />
            <motion.span 
              className="text-primary inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7), hsl(var(--primary)))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              With NovaShop
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={staggerItem}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Discover the latest trends in fashion and technology. Premium quality, 
            exclusive designs, and an shopping experience that feels out of this world.
          </motion.p>
          
          <motion.div 
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            {!user && (
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full border-2">
                    Join Us <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Stats / Social Proof */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: 'Active Users', value: '50k+' },
            { label: 'Premium Products', value: '2000+' },
            { label: 'Happy Customers', value: '99%' },
            { label: 'Fast Delivery', value: '24h' },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
