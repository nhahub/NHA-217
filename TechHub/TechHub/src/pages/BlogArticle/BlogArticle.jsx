import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './BlogArticle.css';

const BlogArticle = () => {
  const { id } = useParams();

  // Mock article data
  const article = {
    id: parseInt(id),
    title: 'Getting Started with Edge AI',
    content: `
      <p>Edge AI is revolutionizing how we deploy artificial intelligence applications. Unlike traditional cloud-based AI, edge AI processes data locally on devices, reducing latency and improving privacy.</p>
      <p>In this comprehensive guide, we'll explore the fundamentals of edge AI development, including hardware selection, model optimization, and deployment strategies.</p>
      <h2>Why Edge AI?</h2>
      <p>Edge AI offers several advantages over cloud-based solutions:</p>
      <ul>
        <li>Reduced latency for real-time applications</li>
        <li>Improved privacy and data security</li>
        <li>Lower bandwidth requirements</li>
        <li>Offline functionality</li>
      </ul>
      <h2>Getting Started</h2>
      <p>To begin your edge AI journey, you'll need the right hardware and software tools. Our Edge AI Development Board is an excellent starting point for beginners and professionals alike.</p>
    `,
    date: '2024-01-15',
    author: 'John Doe',
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: article.title, path: `/blog/${id}` },
  ];

  return (
    <div className="blog-article-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="article-container">
        <article className="article">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-date">{article.date}</span>
            <span className="article-author">By {article.author}</span>
          </div>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <Link to="/blog" className="back-to-blog">
            ← Back to Blog
          </Link>
        </article>
      </div>
    </div>
  );
};

export default BlogArticle;





