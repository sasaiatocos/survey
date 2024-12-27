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
import { Button } from '@/app/ui/Button';
import { Option, Question } from '@/app/libs/type';
import { AlertLabel } from '@/app/ui/AlertLabel';
import styles from './style.module.css';
import { Label } from '@/app/ui/Label';
import { AlertText } from '@/app/ui/AlertText';

const SurveyAnswerPage = () => {
  const { id } = useParams();
  const userId = useAuth().currentUser?.id;
  const { data, loading, error } = useQuery(GET_SURVEY, { variables: { id } });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number[] }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();

  if (!currentUser) {
    router.push('/login');
    return null;
  }

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
        questionId: questionId,
        selectedOptionIds
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
            <div key={question.id} className={styles.questionContainer}>
              <Typography>{question.text}</Typography>
              {question.options.map((option: Option) => (
                <div key={option.id} className={styles.optionContainer}>
                  <Label htmlFor={`question-${question.id}-option-${option.id}`} className={styles.customCheckbox}>
                    <input
                      type='checkbox'
                      name={`question-${question.id}`}
                      value={option.id}
                      id={`question-${question.id}-option-${option.id}`}
                      onChange={() => handleOptionChange(question.id, option.id)}
                      checked={selectedOption[question.id]?.includes(option.id) || false}
                    />
                    <span className={styles.checkbox}></span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          ))}
        </Typography>
        {errorMessage && (
          <AlertLabel>{errorMessage}</AlertLabel>
        )}
        <Button onClick={handleAnswerSubmit} className={styles.submitButton}>
          回答を送信
        </Button>
      </Section>
    </>
  );
};

export default SurveyAnswerPage;