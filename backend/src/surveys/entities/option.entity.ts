import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from 'src/surveys/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Entity('options')
@ObjectType()
export class Option {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  @MaxLength(50)
  text: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.selectedOption)
  answers: Answer[];
}
