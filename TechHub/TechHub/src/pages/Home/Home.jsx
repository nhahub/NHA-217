import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Slider from '../../components/Slider/Slider';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getFeaturedProducts } from '../../api/products';
import { getCategories } from '../../api/categories';
import { useCart } from '../../context/CartContext';
import './Home.css';

const SectionWrapper = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const categoryScrollRef = useRef(null);
  const featuredCategoriesRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getFeaturedProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const heroSlides = [
    {
      background: 'linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 100%)',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
      text: 'Your Electronics, Delivered Swiftly Across Egypt',
    },
  ];

  const categoryIcons = [
    { name: 'Robotics' },
    { name: 'Sensors' },
    { name: 'Development Boards' },
    { name: 'CNC & 3D Printer & Mechanical Parts' },
    { name: 'Tools' },
    { name: 'Integrated Circuits' },
    { name: 'Batteries & Accessories' },
    { name: 'Classic Control Components' },
    { name: 'Wires & Cables & Heat Shrink' },
  ];

  const shopCategories = [
    { name: 'Arduino & Development Boards', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=200&fit=crop' },
    { name: 'Arduino Accessories', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' },
    { name: 'Modules', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' },
    { name: 'Integrated Circuits (Through-hole)', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop' },
    { name: 'Wires', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' },
    { name: 'Motors & Drivers & Wheels', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' },
  ];

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollFeaturedCategories = (direction) => {
    if (featuredCategoriesRef.current) {
      const scrollAmount = 400;
      featuredCategoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const featuredCategories = [
    {
      title: 'ESP Boards',
      description: 'ESP boards are Wi-Fi-enabled microcontrollers that are widely used for IoT applications.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    },
    {
      title: 'Arduino Boards',
      description: 'Arduino boards, with their user-friendly interface, empower creators to effortlessly prototype.',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
    },
    {
      title: 'Raspberry PI',
      description: 'Raspberry Pi is a tiny-sized computer that offers a powerful platform for building innovative... projects.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    },
  ];

  const whyMakersFeatures = [
    {
      title: 'FASTED DELIVERY',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3H5L7.68 14.39C7.77 14.7 7.95 14.98 8.2 15.19L18.5 22H22M22 22L20.5 15.5H9.5M22 22H16M9.5 15.5H16M9.5 15.5L7.5 8.5H3" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 8H3M7 8H5M9 8H7" stroke="#0056CC" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'QUALITY GUARANTEE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'WE ARE ALWAYS READY',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22.08V12" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: 'SUPPORT 24/7',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#0056CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 10H16M8 14H12" stroke="#0056CC" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const topBrands = [
    { name: 'Raspberry Pi', logo: 'https://via.placeholder.com/150x80/FF6B9D/FFFFFF?text=Raspberry+Pi' },
    { name: 'Sanwa', logo: 'https://via.placeholder.com/150x80/E63946/FFFFFF?text=Sanwa' },
    { name: 'SB Super-Bag', logo: 'https://via.placeholder.com/150x80/000000/FFFFFF?text=SB+SUPER-BAG' },
    { name: 'TLITAL', logo: 'https://via.placeholder.com/150x80/06A77D/FFFFFF?text=TLITAL' },
    { name: "Pro'sKit", logo: 'https://via.placeholder.com/150x80/06A77D/FFFFFF?text=Pro\'sKit' },
    { name: 'UNI-T', logo: 'https://via.placeholder.com/150x80/E63946/FFFFFF?text=UNI-T' },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-main">
          <Slider slides={heroSlides} />
        </div>
        <div className="hero-promotional">
          <div className="promo-card promo-card-large">
            <div className="promo-content">
              <h3 className="promo-title">Edge AI Devices, NVIDIA Jetson</h3>
              <Link to="/products" className="shop-now-btn">
                Shop Now →
              </Link>
            </div>
            <div className="promo-image">
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop" 
                alt="NVIDIA Jetson devices"
              />
            </div>
          </div>
          <div className="promo-card promo-card-small">
            <div className="promo-content">
              <div className="promo-icon-wrapper">
                <svg className="flame-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#FF6B35"/>
                </svg>
              </div>
              <h3 className="promo-title">Stepper motors</h3>
            </div>
            <div className="promo-image-small">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" 
                alt="Stepper motors"
              />
            </div>
          </div>
          <div className="promo-card promo-card-small">
            <div className="promo-content">
              <h3 className="promo-title">3D Printer Filament</h3>
            </div>
            <div className="promo-image-small">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop" 
                alt="3D Printer Filament"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Icons */}
      <SectionWrapper>
        <div className="category-navigation">
          <div className="category-icons-container">
            {categoryIcons.map((category, index) => (
              <motion.div 
                key={index} 
                className="category-icon-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
              >
                <div className="category-icon-svg">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0056CC" strokeWidth="2" fill="none"/>
                    <path d="M3 9H21M9 3V21" stroke="#0056CC" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="category-icon-label">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Shop with Category Section */}
      <SectionWrapper>
        <div className="shop-category-section">
          <motion.div 
            className="shop-category-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="shop-category-heading">Shop with Category</h2>
            <Link to="/categories" className="browse-all-link">
              Browse All Categories →
            </Link>
          </motion.div>
        <div className="shop-category-scroll-wrapper">
          <button 
            className="category-scroll-arrow category-scroll-arrow-left"
            onClick={() => scrollCategories('left')}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="shop-category-scroll" ref={categoryScrollRef}>
            {shopCategories.map((category, index) => (
              <motion.div 
                key={index} 
                className="shop-category-card"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="shop-category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="shop-category-name">{category.name}</div>
              </motion.div>
            ))}
          </div>
          <button 
            className="category-scroll-arrow category-scroll-arrow-right"
            onClick={() => scrollCategories('right')}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        </div>
      </SectionWrapper>

      {/* Products Section */}
      <SectionWrapper>
        <div className="content-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Products
          </motion.h2>
          <div className="products-grid">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Featured Categories Section */}
      <div className="featured-categories-section">
        <h2 className="section-title">Featured Categories</h2>
        <div className="featured-categories-wrapper">
          <button 
            className="featured-scroll-arrow featured-scroll-arrow-left"
            onClick={() => scrollFeaturedCategories('left')}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="featured-categories-scroll" ref={featuredCategoriesRef}>
            {featuredCategories.map((category, index) => (
              <div key={index} className="featured-category-card">
                <div className="featured-category-content">
                  <h3 className="featured-category-title">{category.title}</h3>
                  <p className="featured-category-description">{category.description}</p>
                </div>
                <div className="featured-category-image">
                  <img src={category.image} alt={category.title} />
                </div>
              </div>
            ))}
          </div>
          <button 
            className="featured-scroll-arrow featured-scroll-arrow-right"
            onClick={() => scrollFeaturedCategories('right')}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Promotional Banners Section */}
      <div className="promotional-banners-section">
        <div className="promo-banner promo-banner-dark">
          <div className="promo-banner-content">
            <h3 className="promo-banner-title">EXCLUSIVE IN TECHHUB ELECTRONICS</h3>
            <Link to="/products" className="promo-banner-btn">
              CHECK NOW →
            </Link>
          </div>
          <div className="promo-banner-image">
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop" 
              alt="Exclusive electronics"
            />
          </div>
        </div>
        <div className="promo-banner promo-banner-light">
          <div className="promo-banner-content">
            <h3 className="promo-banner-title-light">UNIT MEASUREMENT DEVICES</h3>
            <ul className="promo-banner-list">
              <li>New devices with new features</li>
              <li>High quality measurements devices</li>
              <li>Best prices</li>
            </ul>
            <Link to="/products" className="promo-banner-btn-light">
              CHECK NOW! →
            </Link>
          </div>
          <div className="promo-banner-image">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
              alt="Measurement devices"
            />
          </div>
        </div>
      </div>

      <SectionWrapper>
        <div className="why-makers-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why TechHub!
          </motion.h2>
          <div className="why-makers-grid">
            {whyMakersFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                className="why-makers-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div 
                  className="why-makers-icon"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="why-makers-title">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Top Brands Section */}
      <div className="top-brands-section">
        <h2 className="section-title">Top Brands</h2>
        <div className="top-brands-grid">
          {topBrands.map((brand, index) => (
            <div key={index} className="top-brand-item">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="top-brand-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
