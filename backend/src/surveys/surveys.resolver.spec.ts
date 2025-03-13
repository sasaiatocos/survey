import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResolver } from './surveys.resolver';
import { SurveyService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { QuestionType } from './entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SurveyStats } from './dto/result-surveys';

describe('SurveyResolver', () => {
  let resolver: SurveyResolver;
  let service: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyResolver,
        {
          provide: SurveyService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            createSurvey: jest.fn(),
            toggleSurveyVisibility: jest.fn(),
            getSurveyStats: jest.fn(),
            getMySurveys: jest.fn(),
            findPublicSurveys: jest.fn(),
            findPrivateSurveys: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SurveyResolver>(SurveyResolver);
    service = module.get<SurveyService>(SurveyService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('surveys', () => {
    it('should return an array of surveys', async () => {
      const surveys: Survey[] = [{ id: 1, title: 'Test Survey' } as Survey];
      (service.findAll as jest.Mock).mockResolvedValue(surveys);
      expect(await resolver.getAllSurveys()).toEqual(surveys);
    });
  });

  describe('survey', () => {
    it('should return a survey by id', async () => {
      const survey: Survey = { id: 1, title: 'Test Survey' } as Survey;
      (service.findOne as jest.Mock).mockResolvedValue(survey);
      expect(await resolver.getSurvey(1)).toEqual(survey);
    });
  });

  describe('createSurvey', () => {
    it('should create a survey', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [{ text: 'Question 1', type: QuestionType.OPEN_ENDED }],
      };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'admin',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: [],
        userSurveys: [],
      };
      const survey: Survey = { id: 1, title: 'Test Survey' } as Survey;
      (service.createSurvey as jest.Mock).mockResolvedValue(survey);
      expect(await resolver.createSurvey(
        createSurveyInput.title,
        createSurveyInput.description,
        createSurveyInput.questions,
        user
      )).toEqual(survey);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const createSurveyInput: CreateSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
        questions: [{ text: 'Question 1', type: QuestionType.OPEN_ENDED }],
      };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'user',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: [],
        userSurveys: [],
      };
      (service.createSurvey as jest.Mock).mockRejectedValue(new ForbiddenException());
      await expect(resolver.createSurvey(
        createSurveyInput.title,
        createSurveyInput.description,
        createSurveyInput.questions,
        user
      )).rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleSurveyVisibility', () => {
    it('should toggle survey visibility', async () => {
      const survey: Survey = { id: 1, title: 'Test Survey', isPublic: true } as Survey;
      (service.toggleSurveyVisibility as jest.Mock).mockResolvedValue(survey);
      expect(await resolver.toggleSurveyVisibility(1, false)).toEqual(survey);
    });

    it('should throw NotFoundException if survey is not found', async () => {
      (service.toggleSurveyVisibility as jest.Mock).mockRejectedValue(new NotFoundException());
      await expect(resolver.toggleSurveyVisibility(1, false)).rejects.toThrow(NotFoundException);
    });
  });

  describe('surveyStats', () => {
    it('should return survey stats', async () => {
      const stats: SurveyStats = {
        totalResponses: 10,
        uniqueRespondents: 8,
        questions: [{ id: 1, text: 'Question 1', options: [{ id: 1, text: 'Option 1', responseCount: 5 }] }],
      };
      (service.getSurveyStats as jest.Mock).mockResolvedValue(stats);
      expect(await resolver.getSurveyStats(1)).toEqual(stats);
    });
  });

  describe('mySurveys', () => {
    it('should return surveys belonging to the user', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        role: 'admin',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: [],
        userSurveys: [],
      };
      const surveys: Survey[] = [{ id: 1, title: 'My Survey' } as Survey];
      (service.getMySurveys as jest.Mock).mockResolvedValue(surveys);
      expect(await resolver.getMySurveys(user)).toEqual(surveys);
    });
  });

  describe('publicSurveys', () => {
    it('should return public surveys', async () => {
      const surveys: Survey[] = [{ id: 1, title: 'Public Survey', isPublic: true } as Survey];
      (service.findPublicSurveys as jest.Mock).mockResolvedValue(surveys);
      expect(await resolver.getPublicSurveys()).toEqual(surveys);
    });
  });

  describe('privateSurveys', () => {
    it('should return private surveys', async () => {
      const surveys: Survey[] = [{ id: 1, title: 'Private Survey', isPublic: false } as Survey];
      (service.findPrivateSurveys as jest.Mock).mockResolvedValue(surveys);
      expect(await resolver.getPrivateSurveys()).toEqual(surveys);
    });
  });
});