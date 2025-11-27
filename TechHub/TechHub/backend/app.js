const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const envOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL;
const allowedOrigins = Array.from(new Set([
  ...defaultOrigins,
  ...(envOrigins
    ? envOrigins.split(',').map(origin => origin.trim()).filter(Boolean)
    : [])
]));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/uploads/products/:filename', require('./controllers/imageController').serveImage);

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/special-orders', require('./routes/specialOrderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

module.exports = app;

