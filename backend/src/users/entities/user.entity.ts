import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MaxLength, IsEmail } from 'class-validator';
import { Answer } from 'src/answers/entities/answer.entity';
import { Survey } from 'src/surveys/entities/survey.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  @MaxLength(50)
  name: string;

  @Column()
  @Field()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar' })
  @Field()
  password: string;

  @Column({ default: 'admin' })
  @Field()
  role: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Field(() => [Survey])
  @OneToMany(() => Survey, (survey) => survey.user)
  surveys: Survey[];
}
