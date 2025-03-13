import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Question, QuestionType } from '../surveys/entities/question.entity';
import { User } from '../users/entities/user.entity';
import { Option } from '../surveys/entities/option.entity';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { AnswerOption } from '../entities/answer-option.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AnswerInput } from './dto/answer.input';

describe('AnswerService', () => {
  let service: AnswerService;
  let answerRepository: Repository<Answer>;
  let surveyRepository: Repository<Survey>;
  let questionRepository: Repository<Question>;
  let userRepository: Repository<User>;
  let optionRepository: Repository<Option>;
  let surveyAnswerRepository: Repository<SurveyAnswer>;
  let answerOptionRepository: Repository<AnswerOption>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        { provide: getRepositoryToken(Answer), useValue: { save: jest.fn(), findOne: jest.fn() } },
        { provide: getRepositoryToken(Survey), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Question), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Option), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(SurveyAnswer), useValue: { save: jest.fn(), findOne: jest.fn() } },
        { provide: getRepositoryToken(AnswerOption), useValue: { save: jest.fn() } },
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
    answerRepository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
    surveyRepository = module.get<Repository<Survey>>(getRepositoryToken(Survey));
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    optionRepository = module.get<Repository<Option>>(getRepositoryToken(Option));
    surveyAnswerRepository = module.get<Repository<SurveyAnswer>>(getRepositoryToken(SurveyAnswer));
    answerOptionRepository = module.get<Repository<AnswerOption>>(getRepositoryToken(AnswerOption));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitAnswer', () => {
    it('should submit answers successfully', async () => {
      const answers: AnswerInput[] = [
        {
          questionId: 1, optionIds: [1], textResponse: 'test', userId: 1,
          surveyId: 1
        },
      ];
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const user = { id: 1 };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const option = { id: 1 };
      const answer = { id: 1 };
      const surveyAnswer = { id: 1 };
      const answerOption = { id: 1 };

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (optionRepository.findOne as jest.Mock).mockResolvedValue(option);
      (answerRepository.save as jest.Mock).mockResolvedValue(answer);
      (surveyAnswerRepository.save as jest.Mock).mockResolvedValue(surveyAnswer);
      (answerOptionRepository.save as jest.Mock).mockResolvedValue(answerOption);

      const result = await service.submitAnswer(answers);
      expect(result).toEqual([answer]);
    });

    it('should throw BadRequestException if no answers are provided', async () => {
      await expect(service.submitAnswer([])).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if survey is not found', async () => {
      const answers: AnswerInput[] = [
        {
          questionId: 1, optionIds: [1], textResponse: 'test', userId: 1,
          surveyId: 1
        },
      ];
      (surveyRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.submitAnswer(answers)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not all questions are answered', async () => {
      const answers: AnswerInput[] = [
        {
          questionId: 1, optionIds: [1], textResponse: 'test', userId: 1,
          surveyId: 1
        },
      ];
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }, { id: 2, type: QuestionType.OPEN_ENDED }] };
      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      await expect(service.submitAnswer(answers)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateAnswerInput', () => {
    it('should validate answer input successfully', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1],
        textResponse: 'test',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const user = { id: 1 };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).resolves.not.toThrow();
    });

    it('should throw NotFoundException if survey is not found', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1],
        textResponse: 'test',
        userId: 1,
      };

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if survey is already answered', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1],
        textResponse: 'test',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const user = { id: 1 };
      const surveyAnswer = { id: 1 };

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if question is not found', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1],
        textResponse: 'test',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const user = { id: 1 };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1],
        textResponse: 'test',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if open-ended question has no text response', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [],
        textResponse: '',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.OPEN_ENDED }] };
      const question = { id: 1, type: QuestionType.OPEN_ENDED };
      const user = { id: 1 };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if multiple-choice question has no options selected', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [],
        textResponse: '',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const user = { id: 1 };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if single-choice question has multiple options selected', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1, 2],
        textResponse: '',
        userId: 1,
      };
      const survey = { id: 1, questions: [{ id: 1, type: QuestionType.SINGLE_CHOICE }] };
      const question = { id: 1, type: QuestionType.SINGLE_CHOICE };
      const user = { id: 1 };
      const surveyAnswer = null;

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (surveyAnswerRepository.findOne as jest.Mock).mockResolvedValue(surveyAnswer);

      await expect(service['validateAnswerInput'](answerInput, new Set())).rejects.toThrow(BadRequestException);
    });
  });

  describe('saveAnswer', () => {
    it('should save open-ended answer successfully', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [],
        textResponse: 'テスト回答',
        userId: 1,
      };
      const survey = { id: 1 };
      const question = { id: 1, type: QuestionType.OPEN_ENDED };
      const user = { id: 1 };
      const answer = { id: 1, textResponse: 'テスト回答' };
      const surveyAnswer = { id: 1 };

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (answerRepository.save as jest.Mock).mockResolvedValue(answer);
      (surveyAnswerRepository.save as jest.Mock).mockResolvedValue(surveyAnswer);

      const result = await service['saveAnswer'](answerInput);
      expect(result).toEqual([answer]);
    });

    it('should save multiple-choice answer successfully', async () => {
      const answerInput: AnswerInput = {
        surveyId: 1,
        questionId: 1,
        optionIds: [1, 2],
        textResponse: '',
        userId: 1,
      };
      const survey = { id: 1 };
      const question = { id: 1, type: QuestionType.MULTIPLE_CHOICE };
      const user = { id: 1 };
      const option1 = { id: 1 };
      const option2 = { id: 2 };
      const answer = { id: 1 };
      const surveyAnswer = { id: 1 };
      const answerOption = { id: 1 };

      (surveyRepository.findOne as jest.Mock).mockResolvedValue(survey);
      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (optionRepository.findOne as jest.Mock).mockResolvedValueOnce(option1).mockResolvedValueOnce(option2);
      (answerRepository.save as jest.Mock).mockResolvedValue(answer);
      (surveyAnswerRepository.save as jest.Mock).mockResolvedValue(surveyAnswer);
      (answerOptionRepository.save as jest.Mock).mockResolvedValue(answerOption);

      const result = await service['saveAnswer'](answerInput);
      expect(result).toEqual([answer, answer]);
    });
  });
});