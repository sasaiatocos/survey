import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const CREATE_SURVEY = gql`
  mutation CreateSurvey($title: String!, $questions: [QuestionInput!]!) {
    createSurvey(title: $title, questions: $questions) {
      id
      title
    }
  }
`;

const AdminPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', ''] }]);

  const [createSurvey, { loading, error }] = useMutation(CREATE_SURVEY);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { text: '', options: ['', ''] }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getAuthCookie();
    if (!token) {
      alert('ログインしていません');
      return;
    }

    const surveyData = {
      title,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options.filter((opt) => opt.trim() !== ''),
      })),
    };

    try {
      await createSurvey({
        variables: surveyData,
      });
      alert('アンケートを作成しました');
      router.push('/');
    } catch (err) {
      alert('アンケート作成に失敗しました');
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].text = value;
      return newQuestions;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].options[optionIndex] = value;
      return newQuestions;
    });
  };

  return (
    <div>
      <h1>アンケート作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アンケートタイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <label>質問 {questionIndex + 1}</label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              required
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>選択肢 {optionIndex + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => handleQuestionChange(questionIndex, '')}>
              質問を削除
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>
          質問を追加
        </button>

        <button type="submit" disabled={loading}>
          {loading ? '作成中...' : 'アンケートを作成'}
        </button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
};

export default AdminPage;
