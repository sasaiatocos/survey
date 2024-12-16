'use client'

import React from 'react';
import { useAuth } from '@/app/_components/AuthContext';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { CardContainer } from '@/app/ui/CardContainer';
import { LinkButton } from '@/app/ui/LinkButton';

const AdminTop: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Section>
          <HeadGroup>
            <Heading level={1} size='small'>
              Loading...
            </Heading>
          </HeadGroup>
        </Section>
      </>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <>
        <Section>
          <HeadGroup>
            <Heading level={1} size='small'>
              アクセス権限がありません
            </Heading>
          </HeadGroup>
        </Section>
      </>
    );
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
          <LinkButton color='orange' href='/admin/survey/create'>
            アンケートの作成
          </LinkButton>
          <LinkButton color='orange' href='/admin/survey/status'>
            アンケートの公開・非公開管理
          </LinkButton>
        </CardContainer>
      </Section>
    </>
  );
};

export default AdminTop;
