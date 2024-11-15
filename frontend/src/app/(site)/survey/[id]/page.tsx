'use client'

import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthContext';

const GET_SURVEY = gql`
  query GetSurvey($id: ID!) {
    getSurvey(id: $id) {
      id
      title
      description
      questions {
        id
        text
        options {
          id
          text
        }
      }
    }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswers($answers: [AnswerInput!]!) {
    submitAnswers(answers: $answers) {
      id
      selectedOptionId
    }
  }
`;

const SurveyAnswerPage = () => {
  const { id } = useParams();
  const userId = useAuth().currentUser?.id;
  const { data, loading, error } = useQuery(GET_SURVEY, { variables: { id } });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number }>({});
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleOptionChange = (questionId: number, optionId: number) => {
    setSelectedOption((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleAnswerSubmit = async () => {
    const answers = Object.keys(selectedOption).map((questionId) => ({
      surveyId: id,
      userId: userId,
      questionId: parseInt(questionId),
      selectedOptionId: selectedOption[parseInt(questionId)],
    }));
    if (answers.length === 0) return;

    try {
      await submitAnswer({
        variables: { answers }
      });

      // 回答後に遷移
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{data?.getSurvey.title}</h1>
      <p>{data?.getSurvey.description}</p>
      {data?.getSurvey.questions.map((question: any) => (
        <div key={question.id}>
          <p>{question.text}</p>
          {question.options.map((option: any) => (
            <div key={option.id}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                onChange={() => handleOptionChange(question.id, option.id)} // 選択肢変更時に状態を更新
                checked={selectedOption[question.id] === option.id} // 現在選択されているオプションを表示
              />
              {option.text}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleAnswerSubmit}>回答を送信</button>
    </div>
  );
};

export default SurveyAnswerPage;