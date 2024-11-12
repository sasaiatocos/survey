import { Module } from '@nestjs/common';
import { Option } from '../surveys/entities/option.entity';
import { Answer } from '../answers/entities/answer.entity';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Option, Answer])],
  providers: [AnswerResolver, AnswerService],
  exports: [TypeOrmModule, AnswerService],
})
export class AnswerModule {}
