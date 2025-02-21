import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { Question, QuestionType } from 'src/surveys/entities/question.entity';
import { Option } from 'src/surveys/entities/option.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import { AnswerInput } from './dto/answer.input';

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
  ) { }

  async submitAnswer(answers: AnswerInput[]): Promise<Answer[]> {
    const savedAnswers: Answer[] = [];
    const answeredSurveys = new Set<number>();

    for (const answerInput of answers) {
      await this.validateAnswerInput(answerInput, answeredSurveys);
      const savedAnswer = await this.saveAnswer(answerInput);
      savedAnswers.push(savedAnswer);
    }
    return savedAnswers;
  }

  private async validateAnswerInput(answerInput: AnswerInput, answeredSurveys: Set<number>): Promise<void> {
    const { surveyId, questionId, selectedOptionIds, textResponse, userId } = answerInput;

    const survey = await this.surveyRepository.findOne({ where: { id: surveyId }, relations: ['questions'] });
    if (!survey) throw new NotFoundException('アンケートが見つかりませんでした');

    if (!answeredSurveys.has(surveyId)) {
      const existingAnswer = await this.answerRepository.findOne({ where: { survey: { id: surveyId }, user: { id: userId } } });
      if (existingAnswer) throw new ForbiddenException('このアンケートはすでに回答済みです');
      answeredSurveys.add(surveyId);
    }

    const question = await this.questionRepository.findOne({ where: { id: questionId, survey: { id: surveyId } } });
    if (!question) throw new NotFoundException('質問が見つかりませんでした');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('このユーザーは存在しません');

    if (question.type === QuestionType.OPEN_ENDED) {
      if (!textResponse || textResponse.trim() === '')
        throw new BadRequestException('自由記述の回答が必要です');
    } else {
      if (!selectedOptionIds || selectedOptionIds.length === 0)
        throw new BadRequestException('少なくとも1つの選択肢を選択してください');
      if (question.type === QuestionType.SINGLE_CHOICE && selectedOptionIds.length > 1)
        throw new BadRequestException('YES/NOの質問には1つの選択肢のみ選択してください');
    }
  }

  private async saveAnswer(answerInput: AnswerInput): Promise<Answer> {
    const { surveyId, questionId, selectedOptionIds, textResponse, userId } = answerInput;

    const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (question.type === QuestionType.OPEN_ENDED) {
      const answer = new Answer();
      answer.survey = survey;
      answer.question = question;
      answer.user = user;
      answer.textResponse = textResponse;
      return this.answerRepository.save(answer);
    } else {
      const selectedOption = await this.optionRepository.findOne({ where: { id: selectedOptionIds[0], question: { id: questionId } } });
      const answer = new Answer();
      answer.survey = survey;
      answer.question = question;
      answer.user = user;
      answer.selectedOption = selectedOption;
      return this.answerRepository.save(answer);
    }
  }
}