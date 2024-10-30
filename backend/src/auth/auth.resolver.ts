import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthInput } from './dto/auth.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

export interface JwtPayload {
  email: string;
  id: number;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async login(@Args('email') email: string,
    @Args('password') password: string,
    @Context() context
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @Context() context,
    @Args('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshToken(
      context.req.user,
      context.req.cookies.refreshToken,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  async logout(@Context() context) {
    return this.authService.logout(
      context.req.user
    );
  }
}
