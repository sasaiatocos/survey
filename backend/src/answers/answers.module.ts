import { Module } from '@nestjs/common';
import { AnswerService } from './answers.service';
import { AnswerResolver } from './answers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { QuestionModule } from 'src/questions/questions.module';
import { SelectionModule } from 'src/selections/selections.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer]),
    QuestionModule,
    SelectionModule,
    UsersModule,
  ],
  providers: [AnswerService, AnswerResolver],
  exports: [TypeOrmModule],
})
export class AnswerModule {}
