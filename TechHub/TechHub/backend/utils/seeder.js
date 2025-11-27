const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890',
    address: {
      street: '123 Admin St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '0987654321',
    address: {
      street: '456 User Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  }
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 79.99,
    originalPrice: 129.99,
    category: 'Electronics',
    brand: 'AudioTech',
    stock: 50,
    images: [
      { url: '/uploads/products/headphones.jpg', alt: 'Wireless Headphones' }
    ],
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    isFeatured: true
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'TechWear',
    stock: 30,
    images: [
      { url: '/uploads/products/smartwatch.jpg', alt: 'Smart Watch' }
    ],
    tags: ['smartwatch', 'fitness', 'wearable'],
    isFeatured: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt in various colors.',
    price: 24.99,
    category: 'Clothing',
    brand: 'EcoWear',
    stock: 100,
    images: [
      { url: '/uploads/products/tshirt.jpg', alt: 'Cotton T-Shirt' }
    ],
    tags: ['clothing', 'organic', 't-shirt']
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'Comprehensive guide to JavaScript programming for beginners and experts.',
    price: 49.99,
    originalPrice: 59.99,
    category: 'Books',
    brand: "O'Reilly",
    stock: 25,
    images: [
      { url: '/uploads/products/jsbook.jpg', alt: 'JavaScript Book' }
    ],
    tags: ['books', 'programming', 'javascript']
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: '12-cup programmable coffee maker with thermal carafe.',
    price: 89.99,
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    stock: 40,
    images: [
      { url: '/uploads/products/coffeemaker.jpg', alt: 'Coffee Maker' }
    ],
    tags: ['kitchen', 'coffee', 'appliance'],
    isFeatured: true
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with carrying strap, non-slip surface.',
    price: 34.99,
    category: 'Sports & Outdoors',
    brand: 'FitLife',
    stock: 60,
    images: [
      { url: '/uploads/products/yogamat.jpg', alt: 'Yoga Mat' }
    ],
    tags: ['yoga', 'fitness', 'exercise']
  },
  {
    name: 'LEGO Creator Set',
    description: 'Build, rebuild, and play with this 3-in-1 Creator set.',
    price: 59.99,
    category: 'Toys & Games',
    brand: 'LEGO',
    stock: 35,
    images: [
      { url: '/uploads/products/lego.jpg', alt: 'LEGO Set' }
    ],
    tags: ['toys', 'lego', 'building']
  },
  {
    name: 'Natural Face Moisturizer',
    description: 'Hydrating face moisturizer with natural ingredients and SPF 30.',
    price: 29.99,
    category: 'Health & Beauty',
    brand: 'PureGlow',
    stock: 70,
    images: [
      { url: '/uploads/products/moisturizer.jpg', alt: 'Face Moisturizer' }
    ],
    tags: ['skincare', 'beauty', 'natural']
  },
  {
    name: 'Car Phone Mount',
    description: 'Universal dashboard phone holder with 360-degree rotation.',
    price: 19.99,
    category: 'Automotive',
    brand: 'DriveSafe',
    stock: 80,
    images: [
      { url: '/uploads/products/phonemount.jpg', alt: 'Phone Mount' }
    ],
    tags: ['automotive', 'phone', 'accessory']
  },
  {
    name: 'Organic Green Tea',
    description: 'Premium organic green tea leaves, 100 tea bags.',
    price: 14.99,
    category: 'Food & Grocery',
    brand: 'TeaTime',
    stock: 90,
    images: [
      { url: '/uploads/products/greentea.jpg', alt: 'Green Tea' }
    ],
    tags: ['tea', 'organic', 'beverage']
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Existing data cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Assign admin user as creator for products
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert products
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`${createdProducts.length} products created`);

    console.log('\n✅ Data imported successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User  - Email: john@example.com, Password: password123');

    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log('✅ Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please specify an option:');
  console.log('  -i : Import sample data');
  console.log('  -d : Delete all data');
  console.log('\nExample: node utils/seeder.js -i');
  process.exit();
}
