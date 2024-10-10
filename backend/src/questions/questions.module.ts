import { Module } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { QuestionResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { SurveyModule } from 'src/surveys/surveys.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), SurveyModule],
  providers: [QuestionService, QuestionResolver],
  exports: [TypeOrmModule],
})
export class QuestionModule {}
