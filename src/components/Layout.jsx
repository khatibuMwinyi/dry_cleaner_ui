import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  DollarSign, 
  Package,
  Shirt
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/invoices', icon: FileText, label: 'Invoices' },
    { path: '/services', icon: Settings, label: 'Services' },
    { path: '/clothing-types', icon: Shirt, label: 'Clothing Types' },
    { path: '/expenses', icon: DollarSign, label: 'Expenses' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">Oweru International</h1>
            <p className="text-sm text-gray-500 mt-1">Dry Cleaner Dashboard</p>
          </div>
          <nav className="mt-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors ${
                    isActive ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;




