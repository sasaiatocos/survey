import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { SurveyService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateQuestionInput } from './dto/create-survey.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../users/entities/user.entity';
import { SurveyStats } from './dto/result-surveys';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey], { name: 'getAllSurveys' })
  async getAllSurveys() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey, { name: 'getSurvey' })
  async getSurvey(@Args('id', { type: () => ID }) id: number) {
    return this.surveyService.findOne(id);
  }

  @Query(() => [Survey])
  async getPublicSurveys(): Promise<Survey[]> {
    return this.surveyService.findPublicSurveys();
  }

  @Query(() => [Survey])
  async getPrivateSurveys(): Promise<Survey[]> {
    return this.surveyService.findPrivateSurveys();
  }

  @Query(() => [Survey])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getMySurveys(@CurrentUser() user: User): Promise<Survey[]> {
    console.log(user);
    return this.surveyService.getMySurveys(user);
  }

  @Mutation(() => Survey, { name: 'toggleSurveyVisibility' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async toggleSurveyVisibility(
    @Args('id', { type: () => ID }) id: number,
    @Args('isPublic') isPublic: boolean,
  ): Promise<Survey> {
    return this.surveyService.toggleSurveyVisibility(id, isPublic);
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

  @Query(() => SurveyStats)
  async getSurveyStats(@Args('surveyId', { type: () => ID }) surveyId: number) {
    return this.surveyService.getSurveyStats(surveyId);
  }
}