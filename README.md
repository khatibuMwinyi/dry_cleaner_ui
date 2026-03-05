# 🧼 Dry Cleaner Dashboard

A modern, intuitive React-based admin dashboard for managing dry cleaning business operations. Built with a focus on user experience, real-time analytics, and role-based access control.


## ✨ Features

- **📊 Interactive Dashboard** - Real-time financial summaries, charts, and top customer insights
- **👥 Customer Management** - Full CRUD operations for customer profiles with contact details
- **🧾 Invoice Management** - Create, manage, preview, and generate PDF invoices with ease
- **📦 Job Tracking** - Track jobs through their lifecycle (received → executed → verified → completed)
- **🛠️ Service Management** - Manage dry cleaning services with pricing and categories
- **💰 Expense Tracking** - Track business expenses with receipt uploads
- **📈 Inventory Management** - Monitor stock levels and low-stock alerts
- **📑 Reports & Analytics** - Generate comprehensive financial reports (daily, weekly, monthly)
- **🔐 Secure Authentication** - JWT-based auth with role-based access control
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

```bash
# Navigate to UI directory
cd dry_cleaner_ui

# Install dependencies
npm install

# Set up environment variables
# Create .env file (see below)

# Start development server
npm run dev
```

The app will run at `http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env` file in the `dry_cleaner_ui` directory:

```env
# API Base URL (pointing to your backend)
VITE_API_BASE_URL=http://localhost:5000/api
```

## 👤 User Roles & Permissions

The dashboard provides role-based access control with three distinct roles:

| Page | ADMIN | CLERK | OPERATOR |
|------|-------|-------|----------|
| Dashboard | ✅ | ❌ | ❌ |
| Customers | ❌ | ✅ | ❌ |
| Invoices | ❌ | ✅ | ❌ |
| Jobs | ❌ | ✅ | ✅ |
| Services | ✅ | ✅ | ❌ |
| Expenses | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| Register User | ✅ | ❌ | ❌ |

### Role Capabilities

- **ADMIN** - Full access to all features including dashboard, service management, user registration, and all analytics
- **CLERK** - Manage customers, invoices, jobs; view services, expenses, inventory, and reports
- **OPERATOR** - Track and update job status (receive, execute, deny jobs)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3 + Bootstrap 5
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **State Management**: React Context API

## 📁 Project Structure

```
dry_cleaner_ui/
├── src/
│   ├── api/                 # API service modules
│   │   ├── analyticsApi.js  # Analytics endpoints
│   │   ├── authApi.js       # Authentication endpoints
│   │   ├── customerApi.js   # Customer endpoints
│   │   ├── expenseApi.js   # Expense endpoints
│   │   ├── inventoryApi.js  # Inventory endpoints
│   │   ├── invoiceApi.js   # Invoice endpoints
│   │   ├── jobApi.js       # Job endpoints
│   │   ├── reportApi.js    # Report endpoints
│   │   ├── serviceApi.js   # Service endpoints
│   │   └── api.js          # Axios instance configuration
│   ├── auth/
│   │   └── AuthContext.jsx # Authentication context provider
│   ├── components/
│   │   ├── Dashboard/       # Dashboard-specific components
│   │   │   ├── Charts.jsx
│   │   │   ├── FinancialSummary.jsx
│   │   │   └── TopCustomers.jsx
│   │   ├── ActionButtons.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── DateFilter.jsx
│   │   ├── Dropdown.jsx
│   │   ├── EmptyState.jsx
│   │   ├── InvoiceTable.jsx
│   │   ├── JobTable.jsx
│   │   ├── Layout.jsx       # Main layout with sidebar
│   │   ├── Loader.jsx
│   │   ├── PreviewModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TableContainer.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main dashboard (Admin only)
│   │   ├── Customers.jsx   # Customer management
│   │   ├── Expenses.jsx     # Expense tracking
│   │   ├── Inventory.jsx    # Inventory management
│   │   ├── Invoices.jsx    # Invoice management
│   │   ├── JobTracking.jsx  # Job tracking
│   │   ├── Login.jsx        # Login page
│   │   ├── RegisterAdmin.jsx # User registration
│   │   ├── Reports.jsx      # Analytics & reports
│   │   └── Services.jsx     # Service management
│   ├── utils/
│   │   └── formatNumber.js  # Number formatting utilities
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## 📱 Pages Overview

### Dashboard (Admin Only)
- Financial summary cards (revenue, expenses, profit)
- Revenue chart visualization
- Top customers by spending
- Quick stats overview

### Customers
- List all customers with search/filter
- Add new customer
- Edit customer details
- View customer history

### Invoices
- Create new invoices
- View invoice list with filters
- Preview invoice details
- Generate PDF invoices
- Send invoice via WhatsApp
- Execute services and mark as paid

### Job Tracking
- View all jobs with status filters
- Receive new jobs (Operator)
- Execute jobs (Operator)
- Verify completed jobs (Clerk)
- Deny jobs with reason
- Send pickup notifications (Clerk)

### Services
- View available services
- Add/Edit/Delete services (Admin)
- Track service execution history

### Expenses
- View all expenses
- Add new expense with receipt upload
- Filter by category and date range

### Inventory
- View inventory items
- Add/Edit/Delete inventory (Admin)
- Low stock alerts
- Update stock quantities

### Reports
- Daily, weekly, monthly reports
- Financial analytics
- Export functionality

## 🔐 Authentication Flow

1. User navigates to `/login`
2. Enter credentials (email + password)
3. On success, JWT token stored in localStorage
4. Token included in all API requests via Authorization header
5. Protected routes check for valid token and role permissions
6. Unauthorized access redirects to login

## 🎨 Design Features

- **Modern UI** - Clean, professional interface with Tailwind CSS
- **Responsive Layout** - Sidebar collapses on mobile/tablet
- **Loading States** - Spinners during API calls
- **Error Handling** - Toast notifications for success/error feedback
- **Empty States** - Helpful messages when no data available
- **Status Badges** - Color-coded status indicators
- **Modal Dialogs** - Confirmation and preview modals
- **Date Filters** - Flexible date range selection

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview # Preview production build
```

## 🔗 Related Projects

This dashboard is powered by the **Dry Cleaner API** backend:

- [dry_cleaner_api](https://github.com/KhatibuMwinyi/dry_cleaner_api) - Node.js/Express REST API

## 📄 License

ISC License

---

Built with ❤️ for dry cleaning businesses
