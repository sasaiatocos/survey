'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_SURVEY_MUTATION } from './graphql';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { TextField } from '@/app/ui/TextField';
import { Button } from '@/app/ui/Button';
import { Label } from '@/app/ui/Label/index';
import { Icon } from '@/app/ui/Icon';
import { Select } from '@/app/ui/Select';
import { surveySchema } from './schema';
import { AlertLabel } from '@/app/ui/AlertLabel';
import styles from './style.module.css';

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  OPEN_ENDED: 'OPEN_ENDED',
}

const SurveyCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '', type: QUESTION_TYPES.MULTIPLE_CHOICE, options: ['', '']
    }
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSurvey] = useMutation(CREATE_SURVEY_MUTATION);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: QUESTION_TYPES.MULTIPLE_CHOICE, options: ['', ''] }]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== qIndex));
    }
  };

  const handleQuestionChange = (index: number, field: 'text' | 'type', value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    if (field === 'text') {
      newQuestions[index].text = value;
    } else if (field === 'type') {
      newQuestions[index].type = value;
      if (value === QUESTION_TYPES.SINGLE_CHOICE) {
        newQuestions[index].options = ['', ''];
      } else if (value === QUESTION_TYPES.OPEN_ENDED) {
        newQuestions[index].options = [];
      } else if (value === QUESTION_TYPES.MULTIPLE_CHOICE) {
        newQuestions[index].options = ['', '', ''];
      }
    }
    setQuestions(newQuestions);
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

  const handleSubmit = async () => {
    setErrors([]);
    const surveyData = {
      title,
      description,
      questions: questions.map((q) => ({
        text: q.text,
        type: q.type,
        options: q.type === QUESTION_TYPES.OPEN_ENDED
          ? []
          : q.options.filter((option) => option).map((option) => ({ text: option })),
      })),
    };

    const validationResult = surveySchema.safeParse(surveyData);
    if (!validationResult.success) {
      setErrors(validationResult.error.errors.map((e) => e.message));
      return;
    }
    setIsSubmitting(true);
    try {
      await createSurvey({
        variables: {
          title: surveyData.title,
          description: surveyData.description,
          questions: surveyData.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.type === QUESTION_TYPES.OPEN_ENDED
              ? []
              : q.options.filter((option) => option).map((option) => ({ text: option.text })),
          })),
        }
      });
      alert('アンケートが作成されました');
      router.push('/');
    } catch (e) {
      const error = e as ApolloError;
      console.error('アンケートの作成に失敗しました', e);
      setErrors([error.message || 'アンケートの作成に失敗しました']);
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            新規アンケート作成
          </Heading>
        </HeadGroup>
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <AlertLabel key={index}>{error}</AlertLabel>
            ))}
          </div>
        )}
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
              <div key={qIndex} className={styles.questionContainer}>
                <Label size='xsmall'>質問タイプ</Label>
                <Select
                  className={styles.questionType}
                  value={question.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                >
                  <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>マルチアンサー</option>
                  <option value={QUESTION_TYPES.SINGLE_CHOICE}>シングルアンサー</option>
                  <option value={QUESTION_TYPES.OPEN_ENDED}>フリーアンサー</option>
                </Select>
                <Label size='xsmall'>質問</Label>
                <TextField
                  className={styles.questionText}
                  type='text'
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  placeholder={`質問 ${qIndex + 1}`}
                />
                {question.type !== QUESTION_TYPES.OPEN_ENDED &&
                  question.options.map((option, oIndex) => (
                    <div key={oIndex} className={styles.optionContainer}>
                      <TextField
                        className={styles.optionText}
                        type='text'
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`選択肢 ${oIndex + 1}`}
                      />
                      <Button className={styles.removeOptionButton} onClick={() => handleRemoveOption(qIndex, oIndex)}>
                        <Icon type='close' />
                      </Button>
                    </div>
                  ))
                }
                {question.type !== QUESTION_TYPES.OPEN_ENDED &&
                  <Button
                    className={styles.addOptionButton}
                    onClick={() => handleAddOption(qIndex)}>
                    <Icon type='plus' />
                  </Button>
                }
                <Button
                  className={styles.removeQuestionButton}
                  onClick={() => handleRemoveQuestion(qIndex)}>
                  質問を削除
                </Button>
              </div>
            )
            )}
          </div>
          <Button onClick={handleAddQuestion}>設問を追加</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>アンケートを作成</Button>
        </div>
      </Section>
    </>
  );
};

export default SurveyCreatePage;
