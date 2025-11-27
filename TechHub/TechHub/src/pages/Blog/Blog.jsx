import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="blog-header-content">
          <h1 className="blog-header-title">TechHub Blog</h1>
          <p className="blog-header-description">
            We&apos;re working on publishing real build logs, sourcing tips, and release announcements from the TechHub engineering team. Subscribe below and we&apos;ll email you as soon as the first post goes live.
          </p>
        </div>
      </div>

      <div className="blog-content">
        <div className="blog-container">
          <div className="blog-empty-state">
            <h2>Fresh content is on its way</h2>
            <p>
              No filler or mock articles—only real updates and tutorials once they&apos;re ready.
              In the meantime, browse the store or follow us on social for behind-the-scenes progress.
            </p>
            <div className="blog-empty-actions">
              <a href="mailto:hello@techhub-electronics.com" className="blog-action primary">Contact us</a>
              <Link to="/products" className="blog-action secondary">Browse products</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
