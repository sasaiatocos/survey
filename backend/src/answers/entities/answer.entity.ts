import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { Selection } from 'src/selections/entities/selection.entity';

@Entity('answers')
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @ManyToOne(() => Question, (question) => question.answers, {
    cascade: true,
  })
  question?: Question[];

  @RelationId((answer: Answer) => answer.question)
  questionId: number;

  @Field(() => [Selection])
  @ManyToOne(() => Selection, (selection) => selection.answers, {
    cascade: true,
  })
  selection?: Selection[];

  @RelationId((answer: Answer) => answer.selection)
  selectionId: number;
}
