import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  DollarSign,
  Package,
  Shirt,
} from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/customers", icon: Users, label: "Customers" },
    { path: "/invoices", icon: FileText, label: "Invoices" },
    { path: "/services", icon: Settings, label: "Services" },
    { path: "/clothing-types", icon: Shirt, label: "Clothing Types" },
    { path: "/expenses", icon: DollarSign, label: "Expenses" },
    { path: "/inventory", icon: Package, label: "Inventory" },
  ];

  return (
    <div className="min-h-screen bg-[#DDE1E8]">
      <div className="flex items-start">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F8F8F9] shadow-lg sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Oweru International
            </h1>
            <p className="text-sm text-gray-500 mt-1">Dry Cleaner Dashboard</p>
          </div>
          <hr />
          <nav className="mt-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-[#0F172A] hover:bg-[#2D3A58] hover:text-white transition-colors ${
                    isActive ? "bg-[#0F172A] text-slate-50 " : ""
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
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

