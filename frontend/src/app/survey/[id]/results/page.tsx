import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

// アンケート結果取得クエリ
const GET_SURVEY_RESULTS = gql`
  query GetSurveyResults($id: ID!) {
    surveyResults(id: $id) {
      id
      title
      questions {
        id
        text
        options {
          id
          text
          voteCount
        }
      }
    }
  }
`;

const ResultsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_SURVEY_RESULTS, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <div>
      <h1>{data.surveyResults.title} の集計結果</h1>
      {data.surveyResults.questions.map((question: any) => (
        <div key={question.id}>
          <h2>{question.text}</h2>
          <ul>
            {question.options.map((option: any) => (
              <li key={option.id}>
                {option.text}: {option.voteCount}票
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
