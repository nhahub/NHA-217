import { useState } from 'react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { submitSpecialOrder } from '../../api/specialOrders';
import './SpecialOrder.css';

const initialProduct = { name: '', quantity: '', targetPrice: '', referenceUrl: '' };

const SpecialOrder = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    products: Array(5).fill(null).map(() => ({ ...initialProduct })),
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Special Order Request', path: '/special-order' },
  ];

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, field, value) => {
    setForm((prev) => {
      const updated = prev.products.map((product, idx) =>
        idx === index ? { ...product, [field]: value } : product
      );
      return { ...prev, products: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.phone.trim()) {
      toast.error('Please provide your name and phone number.');
      return;
    }

    const filledProducts = form.products.filter((product) => product.name.trim());
    if (!filledProducts.length) {
      toast.error('Please add at least one product.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSpecialOrder({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        products: filledProducts.map((product) => ({
          ...product,
          quantity: Number(product.quantity) || 1,
          targetPrice: product.targetPrice ? Number(product.targetPrice) : undefined,
        })),
        notes: form.notes,
      });
      toast.success('Special order sent! We will contact you soon.');
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        products: Array(5).fill(null).map(() => ({ ...initialProduct })),
        notes: '',
      });
    } catch (error) {
      toast.error(error.message || 'Unable to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="special-order-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="special-order-card">
        <h1 className="special-order-title">Special Order Request</h1>
        <p className="special-order-subtitle">
          Place a special order if you need any electronics not listed in our store.
          We&apos;ll review it ASAP and reach out with a quotation.
        </p>

        <form className="special-order-form" onSubmit={handleSubmit}>
          <div className="form-grid two-column">
            <label className="form-field">
              <span>First Name *</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                required
              />
            </label>
            <label className="form-field">
              <span>Last Name</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
              />
            </label>
          </div>

          <div className="form-grid two-column">
            <label className="form-field">
              <span>Phone *</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                required
              />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </label>
          </div>

          <div className="products-section">
            {form.products.map((product, index) => (
              <div key={index} className="product-row">
                <label className="form-field flex-grow">
                  <span>{`Product ${index + 1} name${index === 0 ? ' *' : ''}`}</span>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    required={index === 0}
                  />
                </label>
                <label className="form-field">
                  <span>Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  />
                </label>
                <label className="form-field">
                  <span>Target price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.targetPrice}
                    onChange={(e) => handleProductChange(index, 'targetPrice', e.target.value)}
                  />
                </label>
                <label className="form-field flex-grow">
                  <span>Reference URL</span>
                  <input
                    type="url"
                    value={product.referenceUrl}
                    onChange={(e) => handleProductChange(index, 'referenceUrl', e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>

          <label className="form-field">
            <span>Notes</span>
            <textarea
              rows="4"
              value={form.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Share any extra context, delivery deadline, or specs."
            />
          </label>

          <button className="special-order-submit" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpecialOrder;





