import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Services from './pages/Services';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute allowRoles={["ADMIN"]}>
                        <Customers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ProtectedRoute allowRoles={["ADMIN"]}>
                        <Invoices />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/services" element={<Services />} />
                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute allowRoles={["ADMIN", "MODERATOR"]}>
                        <Expenses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute allowRoles={["MODERATOR"]}>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/register-admin"
                    element={
                      <ProtectedRoute allowRoles={["MODERATOR"]}>
                        <RegisterAdmin />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;







