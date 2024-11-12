import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from 'src/surveys/entities/question.entity';
import { Answer } from '../../answers/entities/answer.entity';

@Entity('options')
@ObjectType()
export class Option {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => [String])
  @MaxLength(50)
  optionText: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.option)
  answers: Answer[];
}
