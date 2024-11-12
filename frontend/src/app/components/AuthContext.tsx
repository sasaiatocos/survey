'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const login = (token: string) => {
    Cookies.set('jwt', token);
    setIsAuthenticated(true);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const logout = () => {
    Cookies.remove('jwt');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
