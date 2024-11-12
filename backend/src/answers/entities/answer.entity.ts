import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Option } from 'src/surveys/entities/option.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('answers')
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: number;

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @Field(() => [Option])
  @ManyToOne(() => Option, (option) => option.id)
  option: Option;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
