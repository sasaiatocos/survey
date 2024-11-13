'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

const LoginPage: React.FC = () => {
  const { currentUser, isAuthenticated, loading, refetchUser } = useAuth();
  const router = useRouter();
  const [login, { loading: loginLoading, error }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.push('/');
    }
  }, [isAuthenticated, currentUser, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login({ variables: { email, password } });
      await refetchUser();
      router.push('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Login</h1>
      {error && <p>Error: {error.message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit" disabled={loginLoading}>
          {loginLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
