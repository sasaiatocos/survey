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

    const answeredSurveys = new Set<number>();

    for (const answerInput of answers) {
      const { surveyId, questionId, selectedOptionIds, userId } = answerInput;
      const survey = await this.surveyRepository.findOne({
        where: { id: surveyId },
        relations: ['questions']
      });
      if (!survey) {
        throw new Error('アンケートが見つかりませんでした');
      }

      if (!answeredSurveys.has(surveyId)) {
        const existingAnswer = await this.answerRepository.findOne({
          where: { survey: { id: surveyId }, user: { id: userId } },
        });
        if (existingAnswer) {
          throw new ForbiddenException('このアンケートはすでに回答済みです');
        }
        answeredSurveys.add(surveyId);
      }

      const question = await this.questionRepository.findOne({ where: { id: questionId, survey: { id: surveyId } } });
      if (!question) {
        throw new Error('質問が見つかりませんでした');
      }

      for (const selectedOptionId of selectedOptionIds) {
        const selectedOption = await this.optionRepository.findOne({
          where: { id: selectedOptionId, question: { id: questionId } },
        });
        if (!selectedOption) {
          throw new NotFoundException('選択肢が見つかりませんでした');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('このユーザーは存在しません');
        }

        const answer = new Answer();
        answer.survey = survey;
        answer.question = question;
        answer.user = user;
        answer.selectedOption = selectedOption;

        const savedAnswer = await this.answerRepository.save(answer);
        savedAnswers.push(savedAnswer);
      }
    }
    return savedAnswers;
  }
}
