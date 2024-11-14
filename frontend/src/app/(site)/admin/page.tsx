'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/_components/AuthContext';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { CardContainer } from '@/app/ui/CardContainer';
import { Typography } from '@/app/ui/Typography';

const AdminTop: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <div>アクセス権限がありません。</div>;
  };

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            管理者用トップ
          </Heading>
        </HeadGroup>
        <CardContainer>
          <Typography>
            <Link href='/admin/survey/create'>
              アンケートの作成
            </Link>
          </Typography>
          <Typography>
            <Link href='/admin/survey/status'>
              アンケートの公開・非公開管理
            </Link>
          </Typography>
          <Typography>
            <Link href='/admin/survey/edit'>
              非公開アンケートの編集・削除
            </Link>
          </Typography>
        </CardContainer>
      </Section>
    </>
  );
};

export default AdminTop;
