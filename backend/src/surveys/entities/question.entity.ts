import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Survey } from './survey.entity';
import { Option } from 'src/surveys/entities/option.entity';
import { Answer } from 'src/answers/entities/answer.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  OPEN_ENDED = 'OPEN_ENDED'
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
})

@Entity('questions')
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 200 })
  @Field()
  @MaxLength(50)
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  @Field(() => QuestionType)
  type: QuestionType

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Survey])
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => [Option])
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
