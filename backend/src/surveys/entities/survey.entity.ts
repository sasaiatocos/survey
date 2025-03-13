import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from './question.entity';
import { UserSurvey } from '../../entities/user-survey.entity';
import { SurveyAnswer } from '../../entities/survey-answer.entity';

@Entity('surveys')
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  @MaxLength(50)
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ default: false })
  @Field()
  isPublic: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @OneToMany(() => UserSurvey, userSurvey => userSurvey.survey)
  @Field(() => [UserSurvey])
  userSurveys: UserSurvey[];

  @OneToMany(() => SurveyAnswer, surveyAnswer => surveyAnswer.survey)
  @Field(() => [SurveyAnswer])
  surveyAnswers: SurveyAnswer[];
}
