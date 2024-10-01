import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSelectionInput } from './dto/selection.dto';
import { Selection } from './entities/selection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SelectionService {
  constructor(
    @InjectRepository(Selection)
    private selectionRepository: Repository<Selection>,
  ) {}

  getAll(): Promise<Selection[]> {
    return this.selectionRepository.find();
  }

  async create(data: CreateSelectionInput): Promise<Selection> {
    const selection = this.selectionRepository.create(data);
    await this.selectionRepository.save(selection);
    return selection;
  }
}
