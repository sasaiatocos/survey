'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { User } from '../libs/type';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const USER_QUERY = gql`
  query currentUser {
    user {
      id
      name
      email
      role
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();
  const { data, loading, refetch } = useQuery(USER_QUERY);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    if (!loading && data?.user) {
      setCurrentUser(data.user);
    } else {
      setCurrentUser(null);
    }
  }, [data, loading]);

  const refetchUser = async () => {
    try {
      const { data } = await refetch();
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setCurrentUser(null);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      setCurrentUser(null);
      client.clearStore();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loading,
      isAdmin,
      refetchUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
