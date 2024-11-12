import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { OptionCount } from './dto/option-count.output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
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
    @Args('input') input: CreateSurveyInput,
    @CurrentUser() user: User,
  ) {
    return this.surveyService.create(input, user);
  }

  @Query(() => [OptionCount], { name: 'getSurveyResults' })
  async getSurveyResults(@Args('surveyId') surveyId: number) {
    return this.surveyService.getResults(surveyId);
  }
}