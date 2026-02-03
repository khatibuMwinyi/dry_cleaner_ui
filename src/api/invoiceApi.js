import api from "./api.js";

export const invoiceAPI = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  getPreview: (id) => api.get(`/invoices/${id}/preview`),
  getByCustomer: (customerId) => api.get(`/invoices/customer/${customerId}`),
  create: (data) => api.post("/invoices", data),
  markPaid: (id) => api.post(`/invoices/${id}/pay`),
  executeServices: (id) => api.post(`/invoices/${id}/execute`),
  sendWhatsappInvoice: (id) => api.post(`/invoices/${id}/send-whatsapp`),
};