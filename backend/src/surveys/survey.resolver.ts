import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { CreateQuestionInput } from './dto/create-survey.input';
import { OptionCount } from './dto/option-count.output';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey], { name: 'getAllSurveys' })
  async getAllSurveys() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey, { name: 'getSurvey' })
  async getSurvey(@Args('id') id: number) {
    return this.surveyService.findOne(id);
  }

  @Mutation(() => Survey, { name: 'createSurvey' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createSurvey(
    @Args('title') title: string,
    @Args('description', { type: () => String, nullable: true }) description: string,
    @Args('questions', { type: () => [CreateQuestionInput] }) questions: CreateQuestionInput[],
    @CurrentUser() user: User,
  ): Promise<Survey> {
    const surveyData = { title, description: description ?? null, questions };
    return this.surveyService.createSurvey(surveyData, user);
  }

  @Query(() => [OptionCount], { name: 'getSurveyResults' })
  async getSurveyResults(@Args('surveyId') surveyId: number) {
    return this.surveyService.getResults(surveyId);
  }
}