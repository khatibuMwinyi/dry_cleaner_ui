import api from "./api.js";

export const analyticsAPI = {
  getFinancial: (params) => api.get("/analytics/financial", { params }),
  getDaily: () => api.get("/analytics/daily"),
  getMonthly: () => api.get("/analytics/monthly"),
  getTopCustomers: (limit) =>
    api.get("/analytics/top-customers", { params: { limit } }),
  getCustomerExpenses: (customerId, params) =>
    api.get(`/analytics/customers/${customerId}/expenses`, { params }),
};