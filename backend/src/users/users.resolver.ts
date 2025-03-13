import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@CurrentUser() user: User) {
    return this.userService.getOneByEmail(user.email);
  }
}
