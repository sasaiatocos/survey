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
import { Option, Question, QuestionType } from '@/app/libs/type';
import { AlertLabel } from '@/app/ui/AlertLabel';
import styles from './style.module.css';
import { Label } from '@/app/ui/Label';
import { AlertText } from '@/app/ui/AlertText';
import { TextField } from '@/app/ui/TextField';

const SurveyAnswerPage = () => {
  const { id: idStringOrArray } = useParams();
  const idString = Array.isArray(idStringOrArray) ? idStringOrArray[0] : idStringOrArray;
  const userIdString = String(useAuth().currentUser?.id);
  const id = parseInt(idString, 10);
  const userId = userIdString ? parseInt(userIdString, 10) : undefined;
  const { data, loading, error } = useQuery(GET_SURVEY, { variables: { id } });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number[] }>({});
  const [textResponses, setTextResponses] = useState<{ [key: number]: string }>({});
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

  const handleOptionChange = (questionId: number, optionIdString: string, questionType: QuestionType) => {
    const optionId = parseInt(optionIdString, 10);
    setSelectedOption((prev) => {
      if (questionType === QuestionType.SINGLE_CHOICE) {
        return { ...prev, [questionId]: [optionId] };
      }
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

  const handleTextChange = (questionId: number, text: string) => {
    setTextResponses({ ...textResponses, [questionId]: text });
  };

  const handleAnswerSubmit = async () => {
    if (userId === undefined) {
      setErrorMessage('ユーザーIDが取得できませんでした。');
      return;
    }
    const answers = data?.getSurvey.questions.flatMap((question: Question) => {
      if (question.type === QuestionType.OPEN_ENDED) {
        return {
          surveyId: id,
          userId: userId,
          questionId: parseInt(String(question.id), 10),
          textResponse: textResponses[question.id] || '',
        };
      } else {
        return (selectedOption[question.id] || []).map(optionId => ({
          surveyId: id,
          userId: userId,
          questionId: parseInt(String(question.id), 10),
          optionIds: [optionId]
        }));
      }
    }) || [];

    const allQuestionsAnswered = data?.getSurvey.questions.every((question: Question) => {
      if (question.type === QuestionType.OPEN_ENDED) {
        return textResponses[question.id] && textResponses[question.id].trim() !== '';
      } else {
        return selectedOption[question.id] && selectedOption[question.id].length > 0;
      }
    });

    if (!allQuestionsAnswered) {
      setErrorMessage('すべての質問に回答してください。');
      return;
    }

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
    console.log('answers:', answers);
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
              {question.type === 'OPEN_ENDED' ? (
                <TextField
                  className={styles.title}
                  type='text'
                  value={textResponses[question.id] || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  placeholder='回答'
                />
              ) : (
                  question.options.map((option: Option) => (
                    <div key={option.id} className={styles.optionContainer}>
                      <Label
                        htmlFor={`question-${question.id}-option-${option.id}`}
                      >
                        <input
                        className={styles.input}
                        type={question.type === QuestionType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                        name={`question-${question.id}`}
                        value={String(option.id)}
                        id={`question-${question.id}-option-${option.id}`}
                        onChange={() => handleOptionChange(question.id, String(option.id), question.type)}
                        checked={selectedOption[question.id]?.includes(option.id) || false}
                      />
                        {option.text}
                      </Label>
                    </div>
                  ))
                )}
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