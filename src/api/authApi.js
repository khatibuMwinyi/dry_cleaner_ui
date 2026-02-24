import api from "./api.js";

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  registerUser: (data) => api.post("/auth/register-user", data),
};