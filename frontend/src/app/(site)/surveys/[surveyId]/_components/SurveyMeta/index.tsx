import Link from "next/link";
import { Account } from '@/app/ui/Account';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { LinkButton } from '@/app/ui/LinkButton';
import { LinkTag } from '@/app/ui/LinkTag';
import { Section } from '@/app/ui/Section';
import { Typography } from '@/app/ui/Typography';
import type { Category, Photo } from "@/services/type";
import styles from './style.module.css';

type Props = {
  survey: Survey;
  author: {
    id: string;
    name: string | null;
  };
  isOwner: boolean;
};

export function PhotoMeta({ survey, author, isOwner }: Props) {
  return (
    <div className={styles.meta}>
      <Section>
        <HeadGroup>
          <Heading level={3} size='small'>
            写真の概要
          </Heading>
        </HeadGroup>
        <Typography>{survey.description}</Typography>
      </Section>
      <Section>
        <HeadGroup>
          <Heading level={3} size="small">
            カテゴリー
          </Heading>
        </HeadGroup>
      </Section>
    </div>
  );
}