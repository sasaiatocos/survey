import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from './dto/user.dto';
import { CurrentUser } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guards/jwt-refresh-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtRefreshAuthGuard)
  async user(@CurrentUser() user: User) {
    return this.usersService.getOneByEmail(user.email);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(createUserInput);
  }
}
