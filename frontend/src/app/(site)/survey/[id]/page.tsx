'use client'

import { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { Survey, Question, Option, Answer } from '@/app/libs/type';

const GET_SURVEY = gql`
  query GetSurvey($id: ID!) {
    survey(id: $id) {
      id
      title
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
  mutation SubmitAnswer($optionId: ID!, $answers: [AnswerInput!]!) {
    submitAnswer(surveyId: $surveyId, answers: $answers) {
      success
      message
    }
  }
`;

const SurveyPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [answers, setAnswers] = useState<Answer[]>([]);

  const { loading, error, data } = useQuery(GET_SURVEY, {
    variables: { id },
    skip: !id,
  });

  const [submitAnswer] = useMutation(SUBMIT_ANSWER);

  useEffect(() => {
    if (data) {
      const initialAnswers = data.survey.questions.map((question: Question) => ({
        questionId: question.id,
        optionId: '',
      }));
      setAnswers(initialAnswers);
    }
  }, [data]);

  const handleOptionChange = (questionId: string, optionId: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, optionId }
          : answer
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthCookie();

    if (!token) {
      alert('ログインしていません');
      return;
    }

    try {
      const response = await submitAnswer({
        variables: {
          surveyId: id,
          answers,
        },
      });

      if (response.data.submitAnswer.success) {
        alert('回答が送信されました');
        router.push(`/survey/${id}/results`);
      } else {
        alert('回答送信に失敗しました');
      }
    } catch (err) {
      console.error(err);
      alert('回答送信にエラーが発生しました');
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <div>
      <h1>{data.survey.title}</h1>
      <form onSubmit={handleSubmit}>
        {data.survey.questions.map((question: Question) => (
          <div key={question.id}>
            <p>{question.questionText}</p>
            {question.options.map((option: Option) => (
              <div key={option.id}>
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers.find((answer) => answer.questionId === question.id)?.optionId === option.id}
                    onChange={() => handleOptionChange(question.id, option.id)}
                  />
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">回答を送信</button>
      </form>
    </div>
  );
};

export default SurveyPage;
