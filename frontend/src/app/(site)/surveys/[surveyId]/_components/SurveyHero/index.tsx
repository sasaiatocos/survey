import Link from 'next/link';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Section } from '@/app/ui/Section';
import type { GetSurveysQuery } from '@/gql/components';

type Props = {
  survey: Survey;
  isOwner: boolean;
};

export function PhotoHero({ survey, isOwner }: Props) {
  return (
    <Section>
      <HeadGroup>
        <Heading level={2} size='medium'>
          {survey.title}
        </Heading>
      </HeadGroup>
      <Link href={`/surveys/${survey.id}/view`}>
      </Link>
    </Section>
  );
}