import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gqlAuth';
import { SessionLocalAuthGuard } from './guards/session/localAuth';
import { User } from 'src/users/user.decoder';
import { UserEntity } from 'src/users/entities/user.entity';
import { constant } from './common/constants';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthResponse)
  @UseGuards(GqlAuthGuard, SessionLocalAuthGuard)
  login(
    @Args('AuthInput') authInput: AuthInput,
    @User() user: UserEntity,
  ): AuthResponse {
    return {
      LoginSuccessMessage: constant.LOGIN_SUCCESSFUL,
      user: user,
    };
  }
}
