import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../surveys/entities/question.entity';
import { SurveyAnswer } from '../../entities/survey-answer.entity';
import { AnswerOption } from '../../entities/answer-option.entity';

@Entity('answers')
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question: Question;

  @Field(() => [SurveyAnswer])
  @OneToMany(() => SurveyAnswer, surveyAnswer => surveyAnswer.answer)
  surveyAnswers: SurveyAnswer[];

  @Field(() => [AnswerOption])
  @OneToMany(() => AnswerOption, answerOption => answerOption.answer)
  answerOptions: AnswerOption[];

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  textResponse?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

