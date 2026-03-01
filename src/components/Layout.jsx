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
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    ...(user?.role === "CLERK"
      ? [
          { path: "/customers", icon: Users, label: "Customers" },
          { path: "/invoices", icon: FileText, label: "Invoices" },
          { path: "/job-tracking", icon: ClipboardList, label: "Job Tracking" },
          { path: "/services", icon: Settings, label: "Services" },
          { path: "/expenses", icon: DollarSign, label: "Expenses" },
        ]
      : []),
    ...(user?.role === "ADMIN"
      ? [
          { path: "/", icon: LayoutDashboard, label: "Dashboard" },
          { path: "/services", icon: Settings, label: "Services" },
          { path: "/inventory", icon: Package, label: "Inventory" },
          { path: "/expenses", icon: DollarSign, label: "Expenses" },
          { path: "/reports", icon: BarChart3, label: "Reports" },
          { path: "/register-admin", icon: Users, label: "Register User" }
        ]
      : []),
    ...(user?.role === "OPERATOR"
      ? [
          { path: "/job-tracking", icon: ClipboardList, label: "Job Tracking" },
        ]
      : []),
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#DDE1E8] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#F8F8F9] shadow-md z-30 flex items-center justify-between px-4">
        <h1 className="text-sm font-bold text-[#0F172A]">Oweru Dry Cleaners</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#0F172A]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full min-h-screen w-60 bg-[#F8F8F9] shadow-lg z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 hidden lg:block">
          <h1 className="text-lg font-bold text-[#0F172A]">
            Oweru International
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Dry Cleaner</p>
        </div>
        <hr className="hidden lg:block" />
        
        <nav className="flex flex-col h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)]">
          <div className="flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 text-sm text-[#0F172A] hover:bg-[#2D3A58] hover:text-white transition-colors ${
                  isActive ? "bg-[#0F172A] text-white" : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
          </div>

          <div className="p-3 border-t text-sm">
            <div className="text-gray-500">Logged in as</div>
            <div className="font-medium text-[#0F172A] truncate">{user?.email || "-"}</div>
            <div className="text-gray-600">{user?.role || ""}</div>
            <button
              onClick={logout}
              className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 rounded text-sm"
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
      <main className="flex-1 p-3 md:p-4 lg:p-4 w-full overflow-x-hidden overflow-y-auto mt-14 lg:mt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
