import { NotFoundException } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurveyInput } from 'src/surveys/dto/survey.dto';
import { Survey } from 'src/surveys/entities/survey.entity';
import { SurveyService } from 'src/surveys/surveys.service';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey])
  surveys(): Promise<Survey[]> {
    return this.surveyService.getAll();
  }

  @Query(() => Survey)
  async findSurvey(@Args({ name: 'id', type: () => Int }) id: number) {
    const survey = await this.surveyService.getOne(id);
    if (!survey) {
      throw new NotFoundException(id);
    }
    return survey;
  }

  @Mutation(() => Survey)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
  ): Promise<Survey> {
    return await this.surveyService.create(createSurveyInput);
  }
}
