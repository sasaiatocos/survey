import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

const LogoutPage = () => {
  const router = useRouter();

  return <div>ログアウト中...</div>;
};

export default LogoutPage;