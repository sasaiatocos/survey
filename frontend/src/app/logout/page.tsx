import { useEffect } from 'react';
import { removeAuthCookie } from '../utils/auth';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    removeAuthCookie();
    router.push('/login');
  }, [router]);

  return <div>ログアウト中...</div>;
};

export default LogoutPage;