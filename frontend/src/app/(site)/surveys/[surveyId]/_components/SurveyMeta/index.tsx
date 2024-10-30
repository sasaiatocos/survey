import Link from "next/link";
import { Account } from '@/app/ui/Account';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { LinkButton } from '@/app/ui/LinkButton';
import { LinkTag } from '@/app/ui/LinkTag';
import { Section } from '@/app/ui/Section';
import { Typography } from '@/app/ui/Typography';
import type { Survey } from "@/types";
import styles from './style.module.css';

type Props = {
  survey: Survey;
};

export function SurveyMeta({ survey }: Props) {
  return (
    <div className={styles.meta}>
      <Section>
        <HeadGroup>
          <Heading level={3} size='small'>
            アンケートの概要
          </Heading>
        </HeadGroup>
        <Typography>{survey.title}</Typography>
      </Section>
    </div>
  );
}