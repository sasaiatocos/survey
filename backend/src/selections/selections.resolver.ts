import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Selection } from './entities/selection.entity';
import { SelectionService } from './selections.service';
import { CreateSelectionInput } from './dto/selection.dto';

@Resolver(() => Selection)
export class SelectionResolver {
  constructor(private readonly selectionService: SelectionService) {}

  @Query(() => [Selection])
  selections(): Promise<Selection[]> {
    return this.selectionService.getAll();
  }

  @Mutation(() => Selection)
  async createSelection(
    @Args('createSelectionInput') createSelectionInput: CreateSelectionInput,
  ): Promise<Selection> {
    return await this.selectionService.create(createSelectionInput);
  }
}
