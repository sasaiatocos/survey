import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context
  ) {
    return this.authService.login(context.req.user);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @Context() context,
    @Args('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshToken(
      context.req.user,
      context.req.refreshToken,
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
