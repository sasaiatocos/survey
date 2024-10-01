import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  getAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  async create(data: CreateAnswerInput): Promise<Answer> {
    const answer = this.answerRepository.create(data);
    await this.answerRepository.save(answer);
    return answer;
  }
}
