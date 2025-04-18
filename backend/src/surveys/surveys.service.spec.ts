import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './surveys.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Question, QuestionType } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { UserSurvey } from '../entities/user-survey.entity';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { Answer } from '../answers/entities/answer.entity';
import { User } from 'src/users/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';

describe('SurveyService', () => {
  let surveyService: SurveyService;
  let surveyRepository: Repository<Survey>;
  let questionRepository: Repository<Question>;
  let optionRepository: Repository<Option>;
  let answerRepository: Repository<Answer>;
  let userSurveyRepository: Repository<UserSurvey>;
  let surveyAnswerRepository: Repository<SurveyAnswer>;
  let entityManager: EntityManager;

  const mockSurveyRepositoryQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([])
  }

  const mockSurveyRepository = {
    manager: {
      transaction: jest.fn(async (callback) => {
        return await callback(mockEntityManager)
      }),
    },
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(() =>
      mockSurveyRepositoryQueryBuilder as unknown as SelectQueryBuilder<Survey>
    ),
  };

  const mockQuestionRepository = {
    save: jest.fn(),
  };

  const mockOptionRepository = {
    save: jest.fn(),
  };

  const mockAnswerRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserSurveyRepository = {
    save: jest.fn(),
  };

  const mockSurveyAnswerRepositoryQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue([]),
  };

  const mockSurveyAnswerRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() =>
      mockSurveyAnswerRepositoryQueryBuilder as unknown as SelectQueryBuilder<SurveyAnswer>
    ),
  };

  const mockEntityManager = {
    save: jest.fn(),
    transaction: jest.fn(async (callback) => {
      return await callback(mockEntityManager)
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useValue: mockSurveyRepository
        },
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(UserSurvey),
          useValue: mockUserSurveyRepository,
        },
        {
          provide: getRepositoryToken(SurveyAnswer),
          useValue: mockSurveyAnswerRepository,
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: mockAnswerRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    surveyService = module.get<SurveyService>(SurveyService);
    surveyRepository = module.get<Repository<Survey>>(getRepositoryToken(Survey));
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    optionRepository = module.get<Repository<Option>>(getRepositoryToken(Option));
    userSurveyRepository = module.get<Repository<UserSurvey>>(getRepositoryToken(UserSurvey));
    surveyAnswerRepository = module.get<Repository<SurveyAnswer>>(getRepositoryToken(SurveyAnswer));
    answerRepository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(surveyService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of surveys with relations', async () => {
      const expectedSurveys = [{
        id: 1,
        title: 'Survey 1',
        questions: [{
          id: 1,
          text: 'Question 1',
          options: [{ id: 1, text: 'Option 1' }]
        }]
      }];
      (surveyRepository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await surveyService.findAll();
      expect(result).toEqual(expectedSurveys);
      expect(surveyRepository.find).toHaveBeenCalledWith({ relations: ['questions', 'questions.options'] });
    });
  });

  describe('findOne', () => {
    it('should return a survey with relations', async () => {
      const expectedSurvey = {
        id: 1,
        title: 'Survey 1',
        questions: [{
          id: 1, text: 'Question 1',
          options: [{ id: 1, text: 'Option 1' }]
        }]
      };
      (surveyRepository.findOne as jest.Mock).mockResolvedValue(expectedSurvey);
      const result = await surveyService.findOne(1);
      expect(result).toEqual(expectedSurvey);
      expect(surveyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['questions', 'questions.options'] });
    });
  });

  describe('findPublicSurveys', () => {
    it('should return public surveys', async () => {
      const expectedSurveys = [{ id: 1, title: 'Public Survey 1', isPublic: true }];
      (surveyRepository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await surveyService.findPublicSurveys();
      expect(result).toEqual(expectedSurveys);
      expect(surveyRepository.find).toHaveBeenCalledWith({ where: { isPublic: true } });
    });
  });

  describe('findPrivateSurveys', () => {
    it('should return private surveys', async () => {
      const expectedSurveys = [{ id: 1, title: 'Private Survey 1', isPublic: false }];
      (surveyRepository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await surveyService.findPrivateSurveys();
      expect(result).toEqual(expectedSurveys);
      expect(surveyRepository.find).toHaveBeenCalledWith({ where: { isPublic: false } });
    });
  });

  describe('getMySurveys', () => {
    it('should return surveys associated with the user', async () => {
      const user: User = {
        id: 1, email: 'test@example.com',
        password: 'password',
        role: 'user',
        name: 'name',
        createdAt: new Date,
        updatedAt: new Date,
        answers: [],
        userSurveys: []
      };

      const expectedSurveys = [{
        id: 1,
        title: 'My Survey 1',
        questions: [{
          id: 1,
          text: 'Question 1',
          options: [{ id: 1, text: 'Option 1' }]
        }]
      }];

      (mockSurveyRepositoryQueryBuilder.getMany as jest.Mock).mockResolvedValueOnce(expectedSurveys);
      const result = await surveyService.getMySurveys(user);
      expect(result).toEqual(expectedSurveys);
      expect(surveyRepository.createQueryBuilder).toHaveBeenCalledWith('survey');
    });
  });

  describe('toggleSurveyVisibility', () => {
    it('should toggle survey visibility to public', async () => {
      const surveyId = 1;
      const isPublic = true;
      const updatedSurvey = { id: surveyId, title: 'Test Survey', isPublic: isPublic };

      (surveyRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (surveyRepository.findOneBy as jest.Mock).mockResolvedValue(updatedSurvey);

      const result = await surveyService.toggleSurveyVisibility(surveyId, isPublic);
      expect(result).toEqual(updatedSurvey);
      expect(surveyRepository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(surveyRepository.findOneBy).toHaveBeenCalledWith({ id: surveyId });
    });

    it('should toggle survey visibility to private', async () => {
      const surveyId = 1;
      const isPublic = false;
      const updatedSurvey = { id: surveyId, title: 'Test Survey', isPublic: isPublic };

      (surveyRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (surveyRepository.findOneBy as jest.Mock).mockResolvedValue(updatedSurvey);

      const result = await surveyService.toggleSurveyVisibility(surveyId, isPublic);
      expect(result).toEqual(updatedSurvey);
      expect(surveyRepository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(surveyRepository.findOneBy).toHaveBeenCalledWith({ id: surveyId });
    });

    it('should throw NotFoundException if survey is not found during update', async () => {
      const surveyId = 1;
      const isPublic = true;

      (surveyRepository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(surveyService.toggleSurveyVisibility(surveyId, isPublic)).rejects.toThrow(NotFoundException);
      expect(surveyRepository.update).toHaveBeenCalledWith(surveyId, { isPublic });
    });
  });

  describe('getSurveyStats', () => {
    it('should return survey statistics', async () => {
      const surveyId = 1;
      const totalResponses = 10;
      const uniqueRespondents = 5;
      const questions = [
        { questionId: 1, questionText: 'Question 1', optionId: 1, optionText: 'Option 1', responseCount: 3 },
        { questionId: 1, questionText: 'Question 1', optionId: 2, optionText: 'Option 2', responseCount: 7 },
      ];

      (surveyAnswerRepository.count as jest.Mock).mockResolvedValue(totalResponses);
      (surveyAnswerRepository.createQueryBuilder().getRawOne as jest.Mock).mockResolvedValue({ count: uniqueRespondents.toString() });
      (surveyRepository.createQueryBuilder().getRawMany as jest.Mock).mockResolvedValue(questions);

      const result = await surveyService.getSurveyStats(surveyId);

      expect(result).toEqual({
        totalResponses,
        uniqueRespondents,
        questions: [
          { id: 1, text: 'Question 1', options: [{ id: 1, text: 'Option 1', responseCount: 3 }, { id: 2, text: 'Option 2', responseCount: 7 }] },
        ],
      });
    });
  });

  describe('createSurvey', () => {
    it('should create a survey', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            text: 'Question 1',
            type: QuestionType.SINGLE_CHOICE,
            options: [{ text: 'Option 1' }, { text: 'Option 2' }]
          },
          {
            text: 'Question 2',
            type: QuestionType.OPEN_ENDED
          },
        ],
      };
      const user: User = { id: 1, role: 'admin' } as User;
      const savedSurvey: Survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: []
      } as Survey;
      const savedUserSurvey: UserSurvey = {
        id: 1,
        user: { id: 1 } as User,
        survey: { id: 1 } as Survey,
      } as UserSurvey;
      const savedOption1 = {
        id: 1,
        text: 'Option 1',
      };
      const savedOption2 = {
        id: 2,
        text: 'Option 2',
      };
      const savedQuestion1: Question = {
        id: 1,
        text: 'Question 1',
        type: QuestionType.SINGLE_CHOICE,
        options: [
          { ...savedOption1, question: undefined },
          { ...savedOption2, question: undefined },
        ],
        survey: { id: 1 } as Survey,
      } as Question;
      const savedQuestion2: Question = {
        id: 2,
        text: 'Question 2',
        type: QuestionType.OPEN_ENDED,
        options: null,
        survey: { id: 1 } as Survey,
      } as Question;

      mockEntityManager.save.mockImplementation((entity, data) => {
        if (entity === Survey) return Promise.resolve({ ...savedSurvey, ...data });
        if (entity === UserSurvey) return Promise.resolve(savedUserSurvey);
        if (entity === Question) {
          if (data.text === 'Question 1') {
            const clonedOptions = savedQuestion1.options.map(option => ({ ...option, question: undefined }));
            return Promise.resolve({ ...savedQuestion1, ...data, options: clonedOptions });
          };
          if (data.text === 'Question 2') {
            return Promise.resolve({ ...savedQuestion2, ...data });
          };
        }
        if (entity === Option) {
          if (data.text === 'Option 1') return Promise.resolve({ ...savedOption1, ...data, question: { id: 1 } as Question });
          if (data.text === 'Option 2') return Promise.resolve({ ...savedOption2, ...data, question: { id: 1 } as Question });
        }
        return Promise.resolve(data);
      });

      mockEntityManager.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });

      const result = await surveyService.createSurvey(createSurveyInput, user);

      expect(result).toEqual({
        ...savedSurvey,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            id: savedQuestion1.id,
            text: 'Question 1',
            type: QuestionType.SINGLE_CHOICE,
            options: [
              { id: savedOption1.id, text: savedOption1.text },
              { id: savedOption2.id, text: savedOption2.text },
            ],
          },
          {
            id: savedQuestion2.id,
            text: 'Question 2',
            type: QuestionType.OPEN_ENDED,
            options: null,
          },
        ],
      });
      expect(surveyRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
      };
      const user: User = { id: 1, role: 'user' } as User;

      await expect(surveyService.createSurvey(createSurveyInput, user)).rejects.toThrow(ForbiddenException);
    });
  })
});