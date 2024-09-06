import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Survey } from '../../surveys/entities/survey.entity';

@Entity('questions')
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => [String])
  @MaxLength(50)
  title: string;

  @Column({ type: 'varchar', length: 191 })
  @Field(() => [String])
  @MaxLength(191)
  description: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @ManyToOne(() => Survey, (survey) => survey.questions, {
    cascade: true,
  })
  @JoinColumn({
    name: 'survey_id',
    referencedColumnName: 'id',
  })
  readonly survey?: Survey[];
}
