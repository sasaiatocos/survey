import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { Option } from '../surveys/entities/option.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('answer_options')
@ObjectType()
export class AnswerOption {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Answer, answer => answer.answerOptions)
  @JoinColumn({ name: 'answerId' })
  @Field(() => Answer)
  answer: Answer;

  @ManyToOne(() => Option, option => option.answerOptions)
  @JoinColumn({ name: 'optionId' })
  @Field(() => Option)
  option: Option;
}