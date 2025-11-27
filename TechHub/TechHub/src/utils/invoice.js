const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0.00 EGP';
  return `${value.toFixed(2)} EGP`;
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const buildInvoiceHtml = (order) => {
  const itemsRows = (order.items || []).map(
    (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `,
  ).join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin-bottom: 0.25rem; }
          table { border-collapse: collapse; width: 100%; margin-top: 1.5rem; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          th { background: #f8fafc; }
          .summary { margin-top: 1.5rem; width: 320px; }
          .summary div { display: flex; justify-content: space-between; padding: 4px 0; }
          .summary div:last-child { font-weight: 700; border-top: 1px solid #e2e8f0; margin-top: 8px; padding-top: 8px; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <p>Order ${order.orderNumber}</p>
        <p>Date: ${formatDate(order.createdAt)}</p>

        <section>
          <h3>Ship to</h3>
          <p>${order.shippingAddress?.name}</p>
          <p>${order.shippingAddress?.street}</p>
          <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}</p>
          <p>${order.shippingAddress?.country}</p>
        </section>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="summary">
          <div><span>Subtotal</span><span>${formatCurrency(order.pricing?.subtotal)}</span></div>
          <div><span>Tax</span><span>${formatCurrency(order.pricing?.tax)}</span></div>
          <div><span>Shipping</span><span>${formatCurrency(order.pricing?.shipping)}</span></div>
          <div><span>Total</span><span>${formatCurrency(order.pricing?.total)}</span></div>
        </div>
      </body>
    </html>
  `;
};

export const downloadInvoice = (order) => {
  if (!order) return;
  const html = buildInvoiceHtml(order);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${order.orderNumber || 'order-invoice'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


