import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateQuestionInput,
  UpdateQuestionInput,
} from 'src/questions/dto/question.dto';
import { Question } from 'src/questions/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  getAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getOne(id: number) {
    return this.questionRepository.findOne({ where: { id } });
  }

  async create(data: CreateQuestionInput): Promise<Question> {
    const question = this.questionRepository.create(data);
    await this.questionRepository.save(question);
    return question;
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    const question = this.getOne(id);
    if (question) {
      await this.questionRepository.save(updateQuestionInput);
    }
  }

  async delete(id: number) {
    const result = await this.questionRepository.delete(id);
    return result.affected > 0;
  }
}
