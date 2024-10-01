import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUser } from 'src/users/dto/user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUser') createUser: CreateUser): Promise<User> {
    return await this.usersService.createUser(createUser);
  }
}
