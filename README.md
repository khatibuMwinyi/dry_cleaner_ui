# 🎨 Dry Cleaner Dashboard

Modern React dashboard for dry cleaning business management with real-time analytics.

## 🚀 Quick Start
```bash
npm install
npm run dev
```
App runs on `http://localhost:5173`

## ⚙️ Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ✨ Features
- 📊 Real-time dashboard with charts
- 👥 Customer management
- 🧾 Invoice creation & PDFs
- 💰 Expense tracking
- 📦 Inventory control
- 🛠️ Service management
- 📈 Analytics & reports

## 🛠️ Tech Stack
React 18, Vite, Tailwind CSS, React Router, Axios, Recharts, React Toastify

## 📁 Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Route pages
├── api/            # API service modules
├── auth/           # Authentication context
├── utils/          # Utility functions
├── assets/         # Static assets
├── App.jsx         # Main app
└── main.jsx        # Entry point
```

## 🧩 Key Components
- **Layout**: Sidebar navigation + header
- **Dashboard**: Charts, financial summary, top customers
- **ProtectedRoute**: Role-based access control
- **AuthContext**: User authentication state

## 🔐 Authentication
- JWT token-based auth
- Role-based permissions (Admin/Moderator)
- Protected routes with redirects

## 🎨 Styling
- Tailwind CSS for styling
- Responsive design (mobile/tablet/desktop)
- Consistent color scheme and components
- Loading states and error handling

## 📱 Responsive
Fully responsive design that works on:
- Desktop (>1024px)
- Tablet (640px-1024px) 
- Mobile (<640px)

## 🛠️ Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```
