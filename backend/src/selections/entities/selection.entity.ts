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
import { Question } from 'src/questions/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Entity('selections')
@ObjectType()
export class Selection {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => [String])
  @MaxLength(50)
  option: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt: Date;

  @Field(() => [Selection])
  @ManyToOne(() => Question, (question) => question.selections, {
    cascade: true,
  })
  @JoinColumn({
    name: 'question_id',
    referencedColumnName: 'id',
  })
  readonly question?: Question[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.selection)
  answers: Answer[];
}
