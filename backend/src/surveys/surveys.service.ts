import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from 'src/surveys/entities/survey.entity';
import { Repository } from 'typeorm';
import { Args } from '@nestjs/graphql';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  getAll(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  async getOne(id: number) {
    return this.surveyRepository.findOne({ where: { id } });
  }

  async create(
    @Args('title') title: string,
    @Args('expiredAt') expiredAt: string,
  ): Promise<Survey> {
    const survey = new Survey();
    survey.expiredAt = expiredAt;
    survey.title = title;
    return this.surveyRepository.save(survey);
  }

  async changeStatus(
    @Args('status') status: boolean,
    @Args('id') id: number,
  ) {
    const survey = await this.surveyRepository.findOne({ where: { id } });
    survey.status = status;
    return this.surveyRepository.save(survey);
  }

  async getOpenSurvey(): Promise<Survey[]> {
    return this.surveyRepository.createQueryBuilder('survey').where('survey.status = true').getMany();
  }

  async getCloseSurvey(): Promise<Survey[]> {
    return this.surveyRepository.createQueryBuilder('survey').where('survey.status = false').getMany();
  }
}
