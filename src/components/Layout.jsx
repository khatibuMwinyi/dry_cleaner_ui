import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  DollarSign,
  Package,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    ...(user?.role === "ADMIN"
      ? [
          { path: "/customers", icon: Users, label: "Customers" },
          { path: "/invoices", icon: FileText, label: "Invoices" },
        ]
      : []),
    { path: "/services", icon: Settings, label: "Services" },
    ...(user?.role === "MODERATOR"
      ? [{ path: "/inventory", icon: Package, label: "Inventory" }]
      : []),
    { path: "/expenses", icon: DollarSign, label: "Expenses" },
    ...(user?.role === "MODERATOR"
      ? [
          { path: "/reports", icon: BarChart3, label: "Reports" },
          { path: "/register-admin", icon: Users, label: "Register Admin" }
        ]
      : []),
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#DDE1E8]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#F8F8F9] shadow-md z-30 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-[#0F172A]">Oweru International</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#0F172A]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex items-start pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#F8F8F9] shadow-lg overflow-y-auto z-40 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-6 hidden lg:block">
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Oweru International
            </h1>
            <p className="text-sm text-gray-500 mt-1">Dry Cleaner Dashboard</p>
          </div>
          <hr className="hidden lg:block" />
          <nav className="mt-1 flex flex-col h-[calc(100vh-112px)]">
            <div className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-6 py-3 text-[#0F172A] hover:bg-[#2D3A58] hover:text-white transition-colors ${
                    isActive ? "bg-[#0F172A] text-slate-50 " : ""
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            </div>

            <div className="p-4 border-t">
              <div className="text-xs text-gray-500">Logged in as</div>
              <div className="text-sm font-medium text-[#0F172A] truncate">
                {user?.email || "-"}
              </div>
              <div className="text-xs text-gray-600">{user?.role || ""}</div>
              <button
                onClick={logout}
                className="mt-3 w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
