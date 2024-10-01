import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from '../../questions/entities/question.entity';

@Entity('surveys')
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => [String])
  @MaxLength(50)
  title: string;

  @Column({ type: 'date' })
  @Field()
  expired_at: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];
}
