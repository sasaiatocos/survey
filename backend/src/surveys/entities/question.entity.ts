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
import { Survey } from './survey.entity';
import { Option } from 'src/surveys/entities/option.entity';

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

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Survey])
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => [Option])
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
