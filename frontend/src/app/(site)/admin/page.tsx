'use client'

import React, { useEffect } from 'react';
import { useAuth } from '@/app/_components/AuthContext';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { CardContainer } from '@/app/ui/CardContainer';
import { LinkButton } from '@/app/ui/LinkButton';
import { useQuery } from '@apollo/client';
import { GET_MY_SURVEYS } from './graphql';
import { Survey } from '@/app/libs/type';
import { Typography } from '@/app/ui/Typography';
import { Tag } from '@/app/ui/Tag';
import styles from './style.module.css';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const AdminTop: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { data, refetch } = useQuery(GET_MY_SURVEYS);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    refetch();
  }, [pathname, searchParams, refetch]);

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
        {data?.getMySurveys.length > 0 ? (
          <CardContainer>
            {data.getMySurveys.map((survey: Survey) => (
              <Link href={`/survey/${survey.id}`} key={survey.id}>
                <Tag className={styles.title} color='gray'>{survey.title}</Tag>
                <Typography className={styles.description}>{survey.description}</Typography>
              </Link>
            ))
            }
          </CardContainer>
        ) : (
          <CardContainer>
            <Typography>作成したアンケートはありません</Typography>
          </CardContainer>
        )
        }
        <CardContainer>
          <LinkButton color='orange' href='/admin/survey/create'>
            アンケートの作成
          </LinkButton>
          <LinkButton color='orange' href='/admin/survey/status'>
            アンケートの公開・非公開管理
          </LinkButton>
          <LinkButton color='orange' href='/admin/survey/results'>
            アンケートの結果・集計
          </LinkButton>
        </CardContainer>
      </Section>
    </>
  );
};

export default AdminTop;
