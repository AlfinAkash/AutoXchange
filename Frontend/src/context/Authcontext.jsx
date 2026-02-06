import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const userName = Cookies.get("username");
    console.log("Stored username:", userName); 
    console.log("Stored token:", storedToken); 
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    Cookies.set("token", newToken, { expires: 1 });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;