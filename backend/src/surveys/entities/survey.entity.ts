import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from './question.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('surveys')
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  @MaxLength(50)
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ default: true })
  @Field()
  isPublic: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.surveys)
  user: User;

}
