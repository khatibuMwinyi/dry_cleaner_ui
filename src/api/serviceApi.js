import api from "./api.js";

export const serviceAPI = {
  getAll: () => api.get("/services"),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  execute: (id, data) => api.post(`/services/${id}/execute`, data),
  delete: (id) => api.delete(`/services/${id}`),
};