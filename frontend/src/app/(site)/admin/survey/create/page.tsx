'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CREATE_SURVEY_MUTATION } from './graphql';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { TextField } from '@/app/ui/TextField';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label/index';
import { surveySchema } from './schema';
import { AlertLabel } from '@/app/ui/AlertLabel';
import styles from './style.module.css';

const SurveyCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', ''] }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [createSurvey] = useMutation(CREATE_SURVEY_MUTATION);

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
    const surveyData = {
      title,
      description,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options.filter((option) => option),
      })),
    };

    const validationResult = surveySchema.safeParse(surveyData);
    if (!validationResult.success) {
      setErrors(validationResult.error.errors.map((e) => e.message));
      return;
    }
    try {
      await createSurvey({ variables: { surveyData } });
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
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <AlertLabel key={index}>{error}</AlertLabel>
            ))}
          </div>
        )}
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
              <Label size='xsmall'>アンケート説明 (任意)</Label>
              <TextField
                className={styles.description}
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='説明'
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
                        className={styles.option_text}
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
          </div>
        </div>
      </Section>
    </>
  );
};

export default SurveyCreatePage;
