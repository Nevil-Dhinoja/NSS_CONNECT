
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load on app mount
  useEffect(() => {
    const storedToken = localStorage.getItem("nssUserToken");
    const storedName = localStorage.getItem("nssUserName");
    const storedEmail = localStorage.getItem("nssUserEmail");
    const storedRole = localStorage.getItem("nssUserRole");

    if (storedToken && storedName && storedRole) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        logout();
      } else {
        setToken(storedToken);
        setUser({
          name: storedName,
          email: storedEmail,
          role: storedRole,
        });

        // Auto-logout when token expires
        const timeout = setTimeout(() => {
          logout();
        }, payload.exp * 1000 - Date.now());

        return () => clearTimeout(timeout);
      }
    }
  }, []);

const login = (userData, jwt) => {
  localStorage.setItem("nssUserToken", jwt);
  localStorage.setItem("nssUser", JSON.stringify(userData));

  setUser(userData);
  setToken(jwt);
};


  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
