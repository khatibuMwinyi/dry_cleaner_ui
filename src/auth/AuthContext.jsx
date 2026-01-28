import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token && !!user;

  const login = async ({ email, password }) => {
    const res = await authAPI.login({ email, password });
    const nextToken = res.data.token;
    const nextUser = res.data.user;

    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // keep state consistent if storage cleared externally
  useEffect(() => {
    if (!token || !user) return;
    // no-op for now (could validate token later)
  }, [token, user]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


