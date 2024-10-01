import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurveyInput } from 'src/surveys/dto/survey.dto';
import { Survey } from 'src/surveys/entities/survey.entity';
import { Repository } from 'typeorm';

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

  async create(data: CreateSurveyInput): Promise<Survey> {
    const survey = this.surveyRepository.create(data);
    await this.surveyRepository.save(survey);
    return survey;
  }
}
