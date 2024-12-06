'use client'

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_SURVEY, SUBMIT_ANSWER } from './graphql';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { Typography } from '@/app/ui/Typography';
import { CardContainer } from '@/app/ui/CardContainer';
import { Button } from '@/app/ui/Button';
import { Option, Question } from '@/app/libs/type';
import { AlertLabel } from '@/app/ui/AlertLabel';

const SurveyAnswerPage = () => {
  const { id } = useParams();
  const userId = useAuth().currentUser?.id;
  const { data, loading, error } = useQuery(GET_SURVEY, { variables: { id } });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number[] }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleOptionChange = (questionId: number, optionId: number) => {
    setSelectedOption((prev) => {
      const currentOptions = prev[questionId] || [];
      const isAlreadySelected = currentOptions.includes(optionId);
      const updatedOptions = isAlreadySelected
        ? currentOptions.filter((id) => id !== optionId)
        : [...currentOptions, optionId];
      return {
        ...prev,
        [questionId]: updatedOptions,
      };
    });
  };

  const handleAnswerSubmit = async () => {
    const answers = Object.entries(selectedOption).flatMap(([questionId, optionIds]) =>
      optionIds.map((selectedOptionIds) => ({
        surveyId: id,
        userId: userId,
        questionId: parseInt(questionId),
        selectedOptionIds,
      }))
    );
    if (answers.length === 0) {
      setErrorMessage('少なくとも1つの選択肢を選んでください');
      return;
    };

    try {
      await submitAnswer({
        variables: { answers }
      });
      router.push('/');
    } catch (submitError) {
      if (submitError instanceof ApolloError) {
        setErrorMessage(`エラーが発生しました：${submitError.message}`);
      } else {
        setErrorMessage('予期しないエラーが発生しました');
      }
    }
  };

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            {data?.getSurvey.title}
          </Heading>
        </HeadGroup>
        <Typography>
          {data?.getSurvey.questions.map((question: Question) => (
            <div key={question.id}>
              <p>{question.text}</p>
              {question.options.map((option: Option) => (
                <div key={option.id}>
                  <input
                    type='checkbox'
                    name={`question-${question.id}`}
                    value={option.id}
                    onChange={() => handleOptionChange(question.id, option.id)}
                    checked={selectedOption[question.id]?.includes(option.id) || false}
                  />
                  {option.text}
                </div>
              ))}
            </div>
          ))}
        </Typography>
        {errorMessage && (
          <AlertLabel>{errorMessage}</AlertLabel>
        )}
        <Button onClick={handleAnswerSubmit}>
          回答を送信
        </Button>
      </Section>
    </>
  );
};

export default SurveyAnswerPage;