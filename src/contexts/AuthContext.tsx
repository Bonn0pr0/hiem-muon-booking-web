import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (accessToken) {
      // Nếu có accessToken mà chưa có user, tự động fetch user Customer từ backend
      api.get('/api/v1/auth/account')
        .then(res => {
          const userData = res.data.data; // <-- phải lấy .data
          if (userData && userData.id && userData.role === 'Customer') {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        });
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('AuthContext login: userData', userData);
    console.log('AuthContext login: localStorage user', localStorage.getItem('user'));
  };

  const logout = () => {
    console.log('AuthContext: Logout');
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 