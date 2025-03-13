import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './surveys.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Question, QuestionType } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { SurveyAnswer } from '../entities/survey-answer.entity';
import { UserSurvey } from '../entities/user-survey.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';

describe('SurveyService', () => {
  let service: SurveyService;
  let repository: Repository<Survey>;
  let questionRepository: Repository<Question>;
  let optionRepository: Repository<Option>;
  let surveyAnswerRepository: Repository<SurveyAnswer>;
  let userSurveyRepository: Repository<UserSurvey>;
  let queryBuilder: SelectQueryBuilder<Survey>;
  let surveyAnswerQueryBuilder: SelectQueryBuilder<SurveyAnswer>;
  let entityManager: EntityManager;

  const mockSurveyRepository = {
    manager: {
      transaction: jest.fn(),
    },
    save: jest.fn(),
  };

  const mockQuestionRepository = {
    save: jest.fn(),
  };

  const mockOptionRepository = {
    save: jest.fn(),
  };

  const mockUserSurveyRepository = {
    save: jest.fn(),
  };

  const mockEntityManager = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    queryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    } as unknown as SelectQueryBuilder<Survey>;

    surveyAnswerQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    } as unknown as SelectQueryBuilder<SurveyAnswer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SurveyAnswer),
          useValue: {
            count: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(surveyAnswerQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Survey),
          useValue: mockSurveyRepository,
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
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        { provide: getRepositoryToken(Answer), useValue: {} },
        { provide: getRepositoryToken(SurveyAnswer), useValue: {} },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    repository = module.get<Repository<Survey>>(getRepositoryToken(Survey));
    surveyAnswerRepository = module.get<Repository<SurveyAnswer>>(getRepositoryToken(SurveyAnswer));
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    optionRepository = module.get<Repository<Option>>(getRepositoryToken(Option));
    userSurveyRepository = module.get<Repository<UserSurvey>>(getRepositoryToken(UserSurvey));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of surveys with relations', async () => {
      const expectedSurveys = [{ id: 1, title: 'Survey 1', questions: [{ id: 1, text: 'Question 1', options: [{ id: 1, text: 'Option 1' }] }] }];
      (repository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await service.findAll();
      expect(result).toEqual(expectedSurveys);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['questions', 'questions.options'] });
    });
  });

  describe('findOne', () => {
    it('should return a survey with relations', async () => {
      const expectedSurvey = { id: 1, title: 'Survey 1', questions: [{ id: 1, text: 'Question 1', options: [{ id: 1, text: 'Option 1' }] }] };
      (repository.findOne as jest.Mock).mockResolvedValue(expectedSurvey);
      const result = await service.findOne(1);
      expect(result).toEqual(expectedSurvey);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['questions', 'questions.options'] });
    });
  });

  describe('getMySurveys', () => {
    it('should return surveys associated with the user', async () => {
      const user: User = { id: 1 } as User;
      const expectedSurveys = [{
        id: 1, title: 'My Survey 1',
        questions: [{
          id: 1, text: 'Question 1',
          options: [{ id: 1, text: 'Option 1' }]
        }]
      }];
      (queryBuilder.getMany as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await service.getMySurveys(user);
      expect(result).toEqual(expectedSurveys);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('survey');
    });
  });

  describe('findPublicSurveys', () => {
    it('should return public surveys', async () => {
      const expectedSurveys = [{ id: 1, title: 'Public Survey 1', isPublic: true }];
      (repository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await service.findPublicSurveys();
      expect(result).toEqual(expectedSurveys);
      expect(repository.find).toHaveBeenCalledWith({ where: { isPublic: true } });
    });
  });

  describe('findPrivateSurveys', () => {
    it('should return private surveys', async () => {
      const expectedSurveys = [{ id: 1, title: 'Private Survey 1', isPublic: false }];
      (repository.find as jest.Mock).mockResolvedValue(expectedSurveys);
      const result = await service.findPrivateSurveys();
      expect(result).toEqual(expectedSurveys);
      expect(repository.find).toHaveBeenCalledWith({ where: { isPublic: false } });
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle survey visibility to public', async () => {
      const surveyId = 1;
      const isPublic = true;
      const updatedSurvey = { id: surveyId, title: 'Test Survey', isPublic: isPublic };

      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (repository.findOneBy as jest.Mock).mockResolvedValue(updatedSurvey);

      const result = await service.toggleSurveyVisibility(surveyId, isPublic);

      expect(result).toEqual(updatedSurvey);
      expect(repository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: surveyId });
    });

    it('should toggle survey visibility to private', async () => {
      const surveyId = 1;
      const isPublic = false;
      const updatedSurvey = { id: surveyId, title: 'Test Survey', isPublic: isPublic };

      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (repository.findOneBy as jest.Mock).mockResolvedValue(updatedSurvey);

      const result = await service.toggleSurveyVisibility(surveyId, isPublic);

      expect(result).toEqual(updatedSurvey);
      expect(repository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: surveyId });
    });

    it('should throw NotFoundException if survey is not found during update', async () => {
      const surveyId = 1;
      const isPublic = true;

      (repository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.toggleSurveyVisibility(surveyId, isPublic)).rejects.toThrow(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(repository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if survey is not found after update', async () => {
      const surveyId = 1;
      const isPublic = true;

      (repository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.toggleSurveyVisibility(surveyId, isPublic)).rejects.toThrow(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith(surveyId, { isPublic });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: surveyId });
    });
  });

  describe('getSurveyStats', () => {
    it('should return survey statistics', async () => {
      const surveyId = 1;
      const totalResponses = 10;
      const uniqueRespondents = 5;
      const questions = [
        {
          questionId: 1,
          questionText: 'Question 1',
          optionId: 1,
          optionText: 'Option 1',
          responseCount: '3',
        },
        {
          questionId: 1,
          questionText: 'Question 1',
          optionId: 2,
          optionText: 'Option 2',
          responseCount: '7',
        },
      ];

      (surveyAnswerRepository.count as jest.Mock).mockResolvedValue(totalResponses);
      (surveyAnswerQueryBuilder.getRawOne as jest.Mock).mockResolvedValue({ count: uniqueRespondents.toString() });
      (queryBuilder.getRawMany as jest.Mock).mockResolvedValue(questions);

      const result = await service.getSurveyStats(surveyId);

      expect(result).toEqual({
        totalResponses,
        uniqueRespondents,
        questions: [
          { id: 1, text: 'Question 1', options: [{ id: 1, text: 'Option 1', responseCount: 3 }, { id: 2, text: 'Option 2', responseCount: 7 }] },
        ],
      });
      expect(surveyAnswerRepository.count).toHaveBeenCalledWith({ where: { survey: { id: surveyId } } });
      expect(surveyAnswerQueryBuilder.getRawOne).toHaveBeenCalled();
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
    });
  });

  describe('createSurvey', () => {
    it('should create a survey with questions and options', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            text: 'Question 1',
            type: QuestionType.SINGLE_CHOICE,
            options: [{ text: 'Option 1' }, { text: 'Option 2' }],
          },
          {
            text: 'Question 2',
            type: QuestionType.OPEN_ENDED,
          },
        ],
      };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'admin',
        name: 'name',
        createdAt: new Date,
        updatedAt: new Date,
        answers: [],
        userSurveys: []
      };

      const mockSavedSurvey: Survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        userSurveys: [],
        surveyAnswers: []
      };
      const mockSavedQuestion1: Question = {
        id: 1,
        text: 'Question 1',
        type: QuestionType.SINGLE_CHOICE,
        survey: mockSavedSurvey, options: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: []
      };
      const mockSavedQuestion2: Question = {
        id: 2,
        text: 'Question 2',
        type: QuestionType.OPEN_ENDED,
        survey: mockSavedSurvey,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: []
      };
      const mockSavedOption1: Option = {
        id: 1,
        text: 'Option 1',
        question: mockSavedQuestion1,
        createdAt: new Date(),
        updatedAt: new Date(),
        answerOptions: []
      };
      const mockSavedOption2: Option = {
        id: 2,
        text: 'Option 2',
        question: mockSavedQuestion1,
        createdAt: new Date(),
        updatedAt: new Date(),
        answerOptions: []
      };
      const mockSavedUserSurvey: UserSurvey = {
        id: 1,
        user: user,
        survey: mockSavedSurvey,
      };

      (repository.manager.transaction as jest.Mock).mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });

      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedSurvey);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedUserSurvey);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedQuestion1);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedOption1);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedOption2);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedQuestion1);
      (mockEntityManager.save as jest.Mock).mockResolvedValueOnce(mockSavedQuestion2);

      const result = await service.createSurvey(createSurveyInput, user);
      expect(result).toEqual({
        ...mockSavedSurvey,
        questions: [
          { ...mockSavedQuestion1, options: [mockSavedOption1, mockSavedOption2] },
          mockSavedQuestion2,
        ],
      });
      expect(repository.manager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledTimes(7);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
      };
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

      await expect(service.createSurvey(createSurveyInput, user)).rejects.toThrow(ForbiddenException);
    });
  });
});