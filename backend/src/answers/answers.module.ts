import { Module } from '@nestjs/common';
import { AnswerService } from './answers.service';
import { AnswerResolver } from './answers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerService, AnswerResolver],
  exports: [TypeOrmModule],
})
export class AnswerModule {}
