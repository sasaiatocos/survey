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
  TooltipItem,
} from 'chart.js';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Typography } from '@/app/ui/Typography';
import { Option, Question } from '@/app/libs/type';
import { Tag } from '@/app/ui/Tag';
import { AlertText } from '@/app/ui/AlertText';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyResultPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_SURVEY_STATS, { variables: { surveyId: id } });

  if (loading) return (
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

  if (error) {
    return (
      <>
        <Section>
          <HeadGroup>
            <Heading level={1} size='small'>
              <AlertText>
                Error: {error.message}
              </AlertText>
            </Heading>
          </HeadGroup>
        </Section>
      </>
    );
  }

  const surveyStats = data.getSurveyStats;

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート集計結果
          </Heading>
        </HeadGroup>
        <div>
          <Tag>
            総回答数: {surveyStats.totalResponses}
          </Tag>
          <Typography>
            {surveyStats.questions.map((question: Question) => {
              const labels = question.options.map((option: Option) => option.text);
              const responseCounts = question.options.map((option: Option) => option.responseCount);
              const totalResponsesForQuestion = responseCounts.reduce((sum: number, count: number) => sum + count, 0);
              const percentages = responseCounts.map((count: number) =>
                totalResponsesForQuestion > 0 ? ((count / totalResponsesForQuestion) * 100).toFixed(2) : '0.00'
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
                      label: (context: TooltipItem<'bar'>) => {
                        const value = context.raw as number;
                        const percentage = percentages[context.dataIndex];
                        return `${value} 回答 (${percentage}%)`;
                      }
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
                    ticks: {
                      stepSize: 1,
                    }
                  },
                },
              };

              return (
                <Section key={question.id}>
                  <HeadGroup>
                    <Heading level={2} size="small">{question.text}</Heading>
                  </HeadGroup>
                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <Bar data={data} options={options} />
                  </div>
                </Section>
              );
            })}
          </Typography>
        </div>
      </Section>
    </>
  );
};

export default SurveyResultPage;