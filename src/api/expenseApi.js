import api from "./api.js";

export const expenseAPI = {
  getAll: (params) => api.get("/expenses", { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (formData) => api.post("/expenses", formData), // FormData → multer
  update: (id, formData) => api.put(`/expenses/${id}`, formData),
  delete: (id) => api.delete(`/expenses/${id}`),
};