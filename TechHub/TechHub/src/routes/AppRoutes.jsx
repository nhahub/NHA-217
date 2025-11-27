import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Categories from '../pages/Categories/Categories';
import CategoryProducts from '../pages/CategoryProducts/CategoryProducts';
import Blog from '../pages/Blog/Blog';
import BlogArticle from '../pages/BlogArticle/BlogArticle';
import About from '../pages/About/About';
import CustomerService from '../pages/CustomerService/CustomerService';
import Contact from '../pages/Contact/Contact';
import SpecialOrder from '../pages/SpecialOrder/SpecialOrder';
import Login from '../pages/Account/Login';
import Register from '../pages/Account/Register';
import Dashboard from '../pages/Account/Dashboard';
import Orders from '../pages/Account/Orders';
import Wishlist from '../pages/Account/Wishlist';
import Profile from '../pages/Account/Profile';
import Addresses from '../pages/Account/Addresses';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Success from '../pages/Checkout/Success';
import AdminLayout from '../components/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminSettings from '../pages/Admin/AdminSettings';
import ProtectedRoute from './ProtectedRoute';
import Search from '../pages/Search/Search';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/categories/:slug" element={<CategoryProducts />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogArticle />} />
      <Route path="/about" element={<About />} />
      <Route path="/customer-service" element={<CustomerService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/special-order" element={<SpecialOrder />} />
      <Route path="/search" element={<Search />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Account Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute>
            <Addresses />
          </ProtectedRoute>
        }
      />

      {/* Shop Flow Routes */}
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

