'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '../utils/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthCookie(data.token); // トークンをCookieに保存
      router.push('/dashboard'); // ログイン後にダッシュボードへ遷移
    } else {
      alert('ログインに失敗しました');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <label>
          メールアドレス:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          パスワード:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default LoginPage;