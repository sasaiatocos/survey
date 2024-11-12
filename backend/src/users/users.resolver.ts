import { Resolver, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
}
