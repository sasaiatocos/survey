import { Module } from '@nestjs/common';
import { Answer } from '../answers/entities/answer.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import { Question } from 'src/surveys/entities/question.entity';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from 'src/surveys/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Survey, Option, Question, Answer])],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule, AnswerService],
})
export class AnswerModule {}
