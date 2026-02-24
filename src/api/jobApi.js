import api from "./api";

export const jobApi = {
  getJobs: (status) => {
    const params = status ? { status } : {};
    return api.get("/jobs", { params });
  },

  getJobById: (id) => {
    return api.get(`/jobs/${id}`);
  },

  getJobByInvoiceId: (invoiceId) => {
    return api.get(`/jobs/invoice/${invoiceId}`);
  },

  receiveJob: (id, actualClothCount) => {
    return api.patch(`/jobs/${id}/receive`, { actualClothCount });
  },

  executeJob: (id) => {
    return api.patch(`/jobs/${id}/execute`);
  },

  verifyJob: (id, status, notes) => {
    return api.patch(`/jobs/${id}/verify`, { status, notes });
  },

  denyJob: (id, reason) => {
    return api.patch(`/jobs/${id}/deny`, { reason });
  },
};
