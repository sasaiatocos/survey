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
        user,
        survey: savedSurvey
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
        } as Question;
      const savedQuestion2: Question = {
        id: 2,
        text: 'Question 2',
        type: QuestionType.OPEN_ENDED,
        options: null
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
        if (data.text === 'Option 1') return Promise.resolve({ ...savedOption1, ...data, question: undefined });
        if (data.text === 'Option 2') return Promise.resolve({ ...savedOption2, ...data, question: undefined });
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
                    ...savedQuestion1,
                    text: 'Question 1',
                    type: QuestionType.SINGLE_CHOICE,
                    options: [
                        { id: savedOption1.id, text: savedOption1.text },
                        { id: savedOption2.id, text: savedOption2.text },
                    ],
                },
                {
                    ...savedQuestion2,
                    text: 'Question 2',
                    type: QuestionType.OPEN_ENDED,
                    options: null,
                },
            ],
        });
        expect(entityManager.transaction).toHaveBeenCalled();
    });
  })
});