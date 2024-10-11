import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Survey } from '../../surveys/entities/survey.entity';
import { Selection } from 'src/selections/entities/selection.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Entity('questions')
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 200 })
  @Field()
  @MaxLength(50)
  question: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Survey])
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @RelationId((question: Question) => question.survey)
  surveyId: number;

  @Field(() => [Selection])
  @OneToMany(() => Selection, (selection) => selection.question)
  selections: Selection[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
