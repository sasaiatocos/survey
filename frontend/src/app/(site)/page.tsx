import { TopSurveys }  from './_components/TopSurveys';
import styles from './style.module.css';

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.surveys}>
        <TopSurveys />
      </div>
    </div>
  );
}