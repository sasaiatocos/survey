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
import { Question } from './question.entity';
import { User } from 'src/users/entities/user.entity';
import { Answer } from 'src/answers/entities/answer.entity';

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

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.surveys, { nullable: false })
  user: User;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.survey)
  answers: Answer[];

}
