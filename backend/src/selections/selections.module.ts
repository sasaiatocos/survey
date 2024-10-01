import { Module } from '@nestjs/common';
import { SelectionService } from './selections.service';
import { SelectionResolver } from './selections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Selection } from './entities/selection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Selection])],
  providers: [SelectionResolver, SelectionService],
  exports: [TypeOrmModule],
})
export class SelectionModule {}
