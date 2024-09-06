import { Module } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { QuestionResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService, QuestionResolver],
  exports: [TypeOrmModule],
})
export class QuestionModule {}
