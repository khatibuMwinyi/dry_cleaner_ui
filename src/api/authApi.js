import api from "./api.js";

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  registerAdmin: (data) => api.post("/auth/register-admin", data),
};