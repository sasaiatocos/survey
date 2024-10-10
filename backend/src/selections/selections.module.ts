import { Module } from '@nestjs/common';
import { SelectionService } from './selections.service';
import { SelectionResolver } from './selections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Selection } from './entities/selection.entity';
import { QuestionModule } from 'src/questions/questions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Selection]), QuestionModule],
  providers: [SelectionResolver, SelectionService],
  exports: [TypeOrmModule, SelectionService],
})
export class SelectionModule {}
