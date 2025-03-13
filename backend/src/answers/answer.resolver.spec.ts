import { Test, TestingModule } from '@nestjs/testing';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { AnswerInput } from './dto/answer.input';

describe('AnswerResolver', () => {
  let resolver: AnswerResolver;
  let service: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerResolver,
        { provide: AnswerService, useValue: { submitAnswer: jest.fn() } },
      ],
    }).compile();

    resolver = module.get<AnswerResolver>(AnswerResolver);
    service = module.get<AnswerService>(AnswerService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('submitAnswers', () => {
    it('should call answerService.submitAnswer with correct arguments', async () => {
      const answers: AnswerInput[] = [
        {
          questionId: 1, optionIds: [1], textResponse: 'test', userId: 1,
          surveyId: 1
        },
      ];
      await resolver.submitAnswers(answers);
      expect(service.submitAnswer).toHaveBeenCalledWith(answers);
    });
  });
});