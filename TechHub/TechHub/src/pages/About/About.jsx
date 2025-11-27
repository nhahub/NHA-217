import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './About.css';

const About = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ];

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  const blogRef = useRef(null);
  
  const isSection1InView = useInView(section1Ref, { once: true, amount: 0.3 });
  const isSection2InView = useInView(section2Ref, { once: true, amount: 0.3 });
  const isSection3InView = useInView(section3Ref, { once: true, amount: 0.3 });
  const isSection4InView = useInView(section4Ref, { once: true, amount: 0.3 });
  const isSection5InView = useInView(section5Ref, { once: true, amount: 0.3 });
  const isBlogInView = useInView(blogRef, { once: true, amount: 0.3 });

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  return (
    <div className="about-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="about-container">
        <h1 className="page-title">ABOUT</h1>
        
        {/* Blue Banner */}
        <motion.div
          className="about-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About "TechHub Electronics"
        </motion.div>

        {/* Section 1: WHO ARE WE? - Text Left, Image Right */}
        <div className="about-section-wrapper" ref={section1Ref}>
          <div className="about-section-content">
            <motion.div
              className="about-text-content"
              initial={fadeInLeft.initial}
              animate={isSection1InView ? fadeInLeft.animate : fadeInLeft.initial}
              transition={fadeInLeft.transition}
            >
              <div className="section-label">WHO ARE WE?</div>
              <h2 className="section-heading">Leading Electronics Supplier</h2>
              <p className="section-text">
                "TechHub Electronics" is a leading Egyptian company in Electronics supplies and spare parts. 
                We provide electronics Geeks or professionals with the best electronic components 
                and devices to help them make and build smart projects. TechHub always works to 
                develop and support the electronics field in Egypt to create a creative community 
                of electronics Geeks and everyone loves electronics meetings with a making mentality.
              </p>
            </motion.div>
            
            <motion.div
              className="about-image-content"
              initial={fadeInRight.initial}
              animate={isSection1InView ? fadeInRight.animate : fadeInRight.initial}
              transition={fadeInRight.transition}
            >
              <div className="about-image-placeholder">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop" 
                  alt="Electronic components including Raspberry Pi boards and development kits"
                  className="about-image"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 2: WHAT WE DO - Image Left, Text Right */}
        <div className="about-section-wrapper" ref={section2Ref}>
          <div className="about-section-content reverse">
            <motion.div
              className="about-image-content"
              initial={fadeInLeft.initial}
              animate={isSection2InView ? fadeInLeft.animate : fadeInLeft.initial}
              transition={fadeInLeft.transition}
            >
              <div className="about-image-placeholder">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop" 
                  alt="Person holding a circuit board"
                  className="about-image"
                />
              </div>
            </motion.div>
            
            <motion.div
              className="about-text-content"
              initial={fadeInRight.initial}
              animate={isSection2InView ? fadeInRight.animate : fadeInRight.initial}
              transition={fadeInRight.transition}
            >
              <div className="section-label">WHAT WE DO</div>
              <h2 className="section-heading">Import, Supply, Support</h2>
              <ul className="section-list">
                <li>We believe in customer orientation so we work to satisfy our customers' needs</li>
                <li>Import high-quality electronics at the best prices</li>
                <li>Accept special orders from our customers</li>
                <li>Deliver orders over Egypt with the fastest delivery couriers</li>
                <li>Satisfy B2B needs, working with your company to ensure that we supply what really you need for your business success</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Section 3: OUR MISSION - Text Left, Image Right */}
        <div className="about-section-wrapper" ref={section3Ref}>
          <div className="about-section-content">
            <motion.div
              className="about-text-content"
              initial={fadeInLeft.initial}
              animate={isSection3InView ? fadeInLeft.animate : fadeInLeft.initial}
              transition={fadeInLeft.transition}
            >
              <div className="section-label">OUR MISSION</div>
              <h2 className="section-heading">Empowering Innovation</h2>
              <p className="section-text">
                Our mission is to empower electronics enthusiasts, makers, and professionals across Egypt 
                by providing access to high-quality components and cutting-edge technology. We strive to 
                be the bridge between global innovation and local creativity, enabling our community to 
                turn their ideas into reality.
              </p>
              <p className="section-text">
                We are committed to fostering a culture of innovation, learning, and collaboration within 
                the electronics community, ensuring that every maker has the tools they need to succeed.
              </p>
            </motion.div>
            
            <motion.div
              className="about-image-content"
              initial={fadeInRight.initial}
              animate={isSection3InView ? fadeInRight.animate : fadeInRight.initial}
              transition={fadeInRight.transition}
            >
              <div className="about-image-placeholder">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop" 
                  alt="Innovation and technology concept"
                  className="about-image"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 4: OUR VALUES - Image Left, Text Right */}
        <div className="about-section-wrapper" ref={section4Ref}>
          <div className="about-section-content reverse">
            <motion.div
              className="about-image-content"
              initial={fadeInLeft.initial}
              animate={isSection4InView ? fadeInLeft.animate : fadeInLeft.initial}
              transition={fadeInLeft.transition}
            >
              <div className="about-image-placeholder">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="Team collaboration and values"
                  className="about-image"
                />
              </div>
            </motion.div>
            
            <motion.div
              className="about-text-content"
              initial={fadeInRight.initial}
              animate={isSection4InView ? fadeInRight.animate : fadeInRight.initial}
              transition={fadeInRight.transition}
            >
              <div className="section-label">OUR VALUES</div>
              <h2 className="section-heading">Quality, Integrity, Community</h2>
              <ul className="section-list">
                <li><strong>Quality First:</strong> We source only the finest components and rigorously test our products</li>
                <li><strong>Customer Focus:</strong> Your success is our success - we're here to support your projects</li>
                <li><strong>Innovation:</strong> We stay ahead of the curve, bringing the latest technology to Egypt</li>
                <li><strong>Integrity:</strong> Transparent pricing, honest communication, and reliable service</li>
                <li><strong>Community:</strong> Building a vibrant ecosystem of makers, engineers, and innovators</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Section 5: OUR COMMUNITY - Text Left, Image Right */}
        <div className="about-section-wrapper" ref={section5Ref}>
          <div className="about-section-content">
            <motion.div
              className="about-text-content"
              initial={fadeInLeft.initial}
              animate={isSection5InView ? fadeInLeft.animate : fadeInLeft.initial}
              transition={fadeInLeft.transition}
            >
              <div className="section-label">OUR COMMUNITY</div>
              <h2 className="section-heading">Building the Future Together</h2>
              <p className="section-text">
                TechHub is more than just a supplier - we're a community hub for electronics enthusiasts. 
                We organize meetups, workshops, and events that bring together makers, engineers, and 
                innovators to share knowledge, collaborate on projects, and push the boundaries of what's possible.
              </p>
              <p className="section-text">
                Whether you're a student working on your first Arduino project, a professional engineer 
                developing cutting-edge solutions, or a hobbyist exploring the world of electronics, 
                you'll find a welcoming community at TechHub.
              </p>
            </motion.div>
            
            <motion.div
              className="about-image-content"
              initial={fadeInRight.initial}
              animate={isSection5InView ? fadeInRight.animate : fadeInRight.initial}
              transition={fadeInRight.transition}
            >
              <div className="about-image-placeholder">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
                  alt="Community and collaboration"
                  className="about-image"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Blog Preview Section */}
        <div className="about-blog-section" ref={blogRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isBlogInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="blog-section-header">
              <div className="section-label">FROM OUR BLOG</div>
              <h2 className="section-heading">Latest Insights & Tutorials</h2>
              <p className="section-text">Stay updated with the latest in electronics, project tutorials, and industry news</p>
            </div>

            <div className="blog-preview-grid">
              <motion.div
                className="blog-preview-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="blog-preview-image">
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop" 
                    alt="Getting Started with Raspberry Pi"
                  />
                </div>
                <div className="blog-preview-content">
                  <div className="blog-preview-category">Tutorial</div>
                  <h3 className="blog-preview-title">Getting Started with Raspberry Pi: A Complete Beginner's Guide</h3>
                  <p className="blog-preview-excerpt">
                    Learn how to set up your first Raspberry Pi project, from initial configuration to 
                    building your first application. Perfect for beginners!
                  </p>
                  <Link to="/blog" className="blog-preview-link">Read More →</Link>
                </div>
              </motion.div>

              <motion.div
                className="blog-preview-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="blog-preview-image">
                  <img 
                    src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop" 
                    alt="Arduino Projects"
                  />
                </div>
                <div className="blog-preview-content">
                  <div className="blog-preview-category">Projects</div>
                  <h3 className="blog-preview-title">Top 10 Arduino Projects for Makers in 2024</h3>
                  <p className="blog-preview-excerpt">
                    Discover innovative Arduino projects that you can build at home. From smart home 
                    automation to robotics, explore what's possible with Arduino.
                  </p>
                  <Link to="/blog" className="blog-preview-link">Read More →</Link>
                </div>
              </motion.div>

              <motion.div
                className="blog-preview-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="blog-preview-image">
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop" 
                    alt="Electronics Components Guide"
                  />
                </div>
                <div className="blog-preview-content">
                  <div className="blog-preview-category">Guide</div>
                  <h3 className="blog-preview-title">Essential Electronics Components Every Maker Should Know</h3>
                  <p className="blog-preview-excerpt">
                    A comprehensive guide to the most important electronic components, their functions, 
                    and how to use them in your projects.
                  </p>
                  <Link to="/blog" className="blog-preview-link">Read More →</Link>
                </div>
              </motion.div>
            </div>

            <div className="blog-section-footer">
              <Link to="/blog" className="blog-view-all-btn">
                View All Blog Posts →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
