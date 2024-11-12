import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Answer } from '../answers/entities/answer.entity';
import { SurveyService } from 'src/surveys/surveys.service';
import { SurveyResolver } from './survey.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, Option, Answer])],
  providers: [SurveyResolver, SurveyService],
  exports: [TypeOrmModule, SurveyService],
})
export class SurveyModule {}
