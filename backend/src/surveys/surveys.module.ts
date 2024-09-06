import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/surveys/entities/survey.entity';
import { SurveyResolver } from 'src/surveys/surveys.resolver';
import { SurveyService } from 'src/surveys/surveys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyResolver, SurveyService],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
