import { Module } from '@nestjs/common';
import { Answer } from '../answers/entities/answer.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Question } from '../surveys/entities/question.entity';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../surveys/entities/option.entity';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { AnswerOption } from '../entities/answer-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Survey, Option, Question, Answer, SurveyAnswer, AnswerOption])],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule, AnswerService],
})
export class AnswerModule {}
