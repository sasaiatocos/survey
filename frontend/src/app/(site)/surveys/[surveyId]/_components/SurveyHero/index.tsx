import Link from 'next/link';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Section } from '@/app/ui/Section';
import { Survey } from '@/types';
import { SurveyCard } from '@/app/ui/SurveyCard';

type Props = {
  survey: Survey;
};

export function SurveyHero({ survey }: Props) {
  return (
    <Section>
      <HeadGroup>
        <Heading level={2} size='medium'>
          {survey.title}
        </Heading>
      </HeadGroup>
      <Link href={`/surveys/${survey.id}/view`}>
        <SurveyCard
          {...survey}
          showMeta={false}
          actionIcon={{
            iconProps: { type: 'zoom', color: 'gray'}
          }}
          priority
        />
      </Link>
    </Section>
  );
}