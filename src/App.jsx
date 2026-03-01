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
import Reports from './pages/Reports';
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import JobTracking from "./pages/JobTracking";
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
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowRoles={["ADMIN"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute allowRoles={["CLERK"]}>
                        <Customers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ProtectedRoute allowRoles={["CLERK"]}>
                        <Invoices />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/services"
                    element={
                      <ProtectedRoute allowRoles={["CLERK", "ADMIN"]}>
                        <Services />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute allowRoles={["CLERK", "ADMIN"]}>
                        <Expenses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute allowRoles={["CLERK", "ADMIN"]}>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute allowRoles={["CLERK", "ADMIN"]}>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/register-admin"
                    element={
                      <ProtectedRoute allowRoles={["ADMIN"]}>
                        <RegisterAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/job-tracking"
                    element={
                      <ProtectedRoute allowRoles={["CLERK", "OPERATOR"]}>
                        <JobTracking />
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







