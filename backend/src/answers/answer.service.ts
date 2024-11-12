import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Option } from '../surveys/entities/option.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async submitAnswer(userId: number, optionIds: number[]): Promise<Answer[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const options = await this.optionRepository.find({
      where: { id: In(optionIds) },
    });
    if (!options || options.length !== optionIds.length) {
      throw new Error('Invalid options selected');
    }

    const answers = options.map(option => {
      const answer = new Answer();
      answer.user = user;
      answer.option = option;
      return this.answerRepository.save(answer);
    });

    return Promise.all(answers);
  }
}
