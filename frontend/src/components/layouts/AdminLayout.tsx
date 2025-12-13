import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, FolderTree, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
    { icon: Users, label: 'Users', path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">NovaShop</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={async () => {
              try {
                await authService.logout();
              } catch (error) {
                console.error('Logout error', error);
              }
              logout();
              navigate('/login', { state: { fromLogout: true } });
            }}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold">NovaShop Admin</span>
          <Button variant="ghost" size="icon"><Menu /></Button>
        </header>
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
