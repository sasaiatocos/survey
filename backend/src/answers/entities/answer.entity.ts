import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import { Question } from 'src/surveys/entities/question.entity';
import { Option } from 'src/surveys/entities/option.entity';

@Entity('answers')
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.answers, { onDelete: 'CASCADE' })
  survey: Survey;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question: Question;

  @Field(() => Option)
  @ManyToOne(() => Option, (option) => option.answers, { onDelete: 'CASCADE' })
  selectedOption: Option;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
