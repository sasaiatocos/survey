import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
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
  @JoinColumn({
    name: 'question_id',
    referencedColumnName: 'id',
  })
  readonly question?: Question[];

  @Field(() => [Selection])
  @ManyToOne(() => Selection, (selection) => selection.answers, {
    cascade: true,
  })
  @JoinColumn({
    name: 'selection_id',
    referencedColumnName: 'id',
  })
  readonly selection?: Selection[];

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.answers, {
    cascade: true,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  readonly user?: User[];
}
