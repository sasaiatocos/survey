'use client'

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SURVEY_STATS } from './graphql';
import { useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { CardContainer } from '@/app/ui/CardContainer';
import { Label } from '@/app/ui/Label/index';
import { Typography } from '@/app/ui/Typography';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyResultPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_SURVEY_STATS, { variables: { surveyId: id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const surveyStats = data.getSurveyStats;

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート集計結果
          </Heading>
        </HeadGroup>
        <CardContainer>
          <Label>
            総回答数: {surveyStats.totalResponses}
          </Label>
          <Typography>
            {surveyStats.questions.map((question: any) => {
              const labels = question.options.map((option: any) => option.text);
              const responseCounts = question.options.map((option: any) => option.responseCount);
              const totalResponsesForQuestion = responseCounts.reduce((sum: number, count: number) => sum + count, 0);
              const percentages = responseCounts.map((count: number) =>
                totalResponsesForQuestion > 0 ? ((count / totalResponsesForQuestion) * 100).toFixed(2) : "0.00"
              );

              const data = {
                labels,
                datasets: [
                  {
                    label: '回答数',
                    data: responseCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              };

              const options = {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: question.text,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context: any) =>
                        `${context.raw} 回答 (${percentages[context.dataIndex]}%)`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: '回答数',
                    },
                  },
                },
              };

              return (
                <div key={question.id} style={{ marginBottom: '40px' }}>
                  <h2>{question.text}</h2>
                  <Bar data={data} options={options} />
                </div>
              );
            })}
          </Typography>
        </CardContainer>
      </Section>
    </>
  );
};

export default SurveyResultPage;