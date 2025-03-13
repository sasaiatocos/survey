import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Answer } from '../answers/entities/answer.entity';
import { SurveyService } from './surveys.service';
import { SurveyResolver } from './surveys.resolver';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { UserSurvey } from '../entities/user-survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, Option, Answer, UserSurvey, SurveyAnswer])],
  providers: [SurveyResolver, SurveyService],
  exports: [TypeOrmModule, SurveyService],
})
export class SurveyModule {}
