import { redirect } from 'next/navigation';

type Props = {
  params: { surveyId: number };
};

export default async function Page({ params }: Props) {
  redirect(`/surveys/${params.surveyId}`);
}