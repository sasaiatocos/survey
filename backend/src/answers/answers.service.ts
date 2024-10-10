import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { User } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Selection } from 'src/selections/entities/selection.entity';
import { Args } from '@nestjs/graphql';
import { SelectionService } from 'src/selections/selections.service';
import { UsersService } from 'src/users/users.service';
import { QuestionService } from 'src/questions/questions.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private questionService: QuestionService,
    private selectionService: SelectionService,
    private userService: UsersService,
  ) {}

  getAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async create(
    @Args('userId') userId: number,
    @Args('selectionId') selectionId: number,
    @Args('questionId') questionId: number,
  ): Promise<Answer> {
    const user = new User();
    const selection = new Selection();
    const question = new Question();
    const answer = new Answer();
    user.id = userId;
    selection.id = selectionId;
    question.id = questionId;
    return this.answerRepository.save(answer);
  }
}
