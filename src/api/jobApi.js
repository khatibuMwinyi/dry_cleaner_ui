import api from "./api";

export const jobApi = {
  getJobs: (status, startDate, endDate) => {
    const params = {};
    if (status) params.status = status;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
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

  sendPickupNotification: (id) => {
    return api.post(`/jobs/${id}/send-pickup-notification`);
  },
};
