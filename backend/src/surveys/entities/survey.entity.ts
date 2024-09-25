import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Question } from '../../questions/entities/question.entity';
import { UserEntity } from '../../users/entities/user.entity';

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
  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @Field(() => [Survey])
  @ManyToOne(() => UserEntity, (user) => user.surveys, {
    cascade: true,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  readonly user?: UserEntity[];
}
