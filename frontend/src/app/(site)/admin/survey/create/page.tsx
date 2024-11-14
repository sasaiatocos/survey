'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/app/_components/AuthContext';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { TextField } from '@/app/ui/TextField';
import styles from './style.module.css'
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label/index';

const CREATE_SURVEY_MUTATION = gql`
  mutation CreateSurvey($title: String!, $description: String, $questions: [CreateQuestionInput!]!) {
  createSurvey(title: $title, description: $description, questions: $questions) {
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

const SurveyCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', ''] }]);
  const [createSurvey, { data, loading, error }] = useMutation(CREATE_SURVEY_MUTATION);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', ''] }]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== qIndex));
    }
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 1) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const formattedQuestions = questions.map((q) => ({
      text: q.text,
      options: q.options.filter((option) => option),
    }));
    try {
      await createSurvey({ variables: { title, questions: formattedQuestions } });
      alert('アンケートが作成されました');
      router.push('/');
    } catch (e) {
      console.error('アンケートの作成に失敗しました', e);
    }
  };

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            アンケート作成
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <Label size='xsmall'>アンケートタイトル</Label>
              <TextField
                className={styles.title}
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='タイトル'
              />
            </div>
            <div className={styles.row}>
              {questions.map((question, qIndex) => (
                <div key={qIndex}>
                  <Label size='xsmall'>質問文</Label>
                  <TextField
                    className={styles.question_text}
                    type='text'
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder={`質問 ${qIndex + 1}`}
                  />
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className={styles.optionContainer}>
                      <TextField
                        key={oIndex}
                        type='text'
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`選択肢 ${oIndex + 1}`}
                      />
                      {question.options.length > 1 && (
                        <Button onClick={() => handleRemoveOption(qIndex, oIndex)}>
                          選択肢を削除
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button onClick={() => handleAddOption(qIndex)}>選択肢を追加</Button>
                  {questions.length > 1 && (
                    <Button onClick={() => handleRemoveQuestion(qIndex)}>
                      質問を削除
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={handleAddQuestion}>
              質問を追加
            </Button>
            <Button onClick={handleSubmit}>アンケートを作成</Button>
            {error && <p style={{ color: 'red' }}>エラー: {error.message}</p>}
          </div>
        </div>
      </Section>
    </>
  );
};

export default SurveyCreatePage;
