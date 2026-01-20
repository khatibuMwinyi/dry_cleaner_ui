import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Customers
export const customerAPI = {
  getAll: () => api.get("/customers"),
  create: (data) => api.post("/customers", data),
};

// Services
export const serviceAPI = {
  getAll: () => api.get("/services"),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Clothing Types
export const clothingTypeAPI = {
  getAll: () => api.get("/clothing-types"),
  create: (data) => api.post("/clothing-types", data),
  update: (id, data) => api.put(`/clothing-types/${id}`, data),
  delete: (id) => api.delete(`/clothing-types/${id}`),
};

// Invoices
export const invoiceAPI = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  getByCustomer: (customerId) => api.get(`/invoices/customer/${customerId}`),
  create: (data) => api.post("/invoices", data),
  markPaid: (id) => api.post(`/invoices/${id}/pay`),
  sendWhatsappInvoice: (id) => api.post(`/invoices/${id}/send-whatsapp`),
};

// Expenses
export const expenseAPI = {
  getAll: (params) => api.get("/expenses", { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (formData) => api.post("/expenses", formData), // FormData → multer
  update: (id, formData) => api.put(`/expenses/${id}`, formData),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Inventory
export const inventoryAPI = {
  getAll: () => api.get("/inventory"),
  getById: (id) => api.get(`/inventory/${id}`),
  getLowStock: () => api.get("/inventory/low-stock"),
  create: (data) => api.post("/inventory", data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// Analytics
export const analyticsAPI = {
  getFinancial: (params) => api.get("/analytics/financial", { params }),
  getDaily: () => api.get("/analytics/daily"),
  getMonthly: () => api.get("/analytics/monthly"),
  getTopCustomers: (limit) =>
    api.get("/analytics/top-customers", { params: { limit } }),
  getCustomerExpenses: (customerId, params) =>
    api.get(`/analytics/customers/${customerId}/expenses`, { params }),
};

export default api;
