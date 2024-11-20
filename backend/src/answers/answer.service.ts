import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { Question } from 'src/surveys/entities/question.entity';
import { Option } from 'src/surveys/entities/option.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import { AnswerInput } from './answer.input';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async submitAnswer(
    answers: AnswerInput[]
  ): Promise<Answer[]> {
    const savedAnswers: Answer[] = [];

    for (const answerInput of answers) {
      const { surveyId, questionId, selectedOptionId, userId } = answerInput;
      const survey = await this.surveyRepository.findOne({
        where: { id: surveyId },
        relations: ['questions']
      });
      if (!survey) {
        throw new Error('Survey not found');
      }

      const existingAnswer = await this.answerRepository.findOne({
        where: { survey: { id: surveyId }, user: { id: userId } }
      });
      if (existingAnswer) {
        throw new ForbiddenException('You have already answered this survey');
      }

      const question = await this.questionRepository.findOne({ where: { id: questionId, survey: { id: surveyId } } });
      if (!question) {
        throw new Error('Question not found');
      }

      const selectedOption = await this.optionRepository.findOne({
        where: { id: selectedOptionId, question: { id: questionId } },
      });
      if (!selectedOption) {
        throw new NotFoundException('Option not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const answer = new Answer();
      answer.survey = survey;
      answer.question = question;
      answer.user = user;
      answer.selectedOption = selectedOption;

      const savedAnswer = await this.answerRepository.save(answer);
      savedAnswers.push(savedAnswer);
    }
    return savedAnswers;
  }
}
