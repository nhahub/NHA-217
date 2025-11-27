import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './CustomerService.css';

const CustomerService = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Customer Service', path: '/customer-service' },
  ];

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, and cash on delivery.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship within Egypt. International shipping may be available for select products.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You will receive a tracking number via email once your order ships.',
    },
  ];

  return (
    <div className="customer-service-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="service-container">
        <h1 className="page-title">Customer Service</h1>

        <div className="service-sections">
          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="contact-section">
            <h2>Need More Help?</h2>
            <p>Contact our support team:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@techhub-electronics.com</p>
              <p><strong>Phone:</strong> +20 123 456 7890</p>
              <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;




