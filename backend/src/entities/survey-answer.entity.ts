import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('survey_answers')
@ObjectType()
export class SurveyAnswer {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Survey, survey => survey.surveyAnswers)
  @JoinColumn({ name: 'surveyId' })
  @Field(() => Survey)
  survey: Survey;

  @ManyToOne(() => Answer, answer => answer.surveyAnswers)
  @JoinColumn({ name: 'answerId' })
  @Field(() => Answer)
  answer: Answer;
}