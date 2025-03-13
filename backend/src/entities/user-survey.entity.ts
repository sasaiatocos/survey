import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('user_surveys')
@ObjectType()
export class UserSurvey {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => User, user => user.userSurveys)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Survey, survey => survey.userSurveys)
  @JoinColumn({ name: 'surveyId' })
  @Field(() => Survey)
  survey: Survey;
}