import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { Req, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Request } from 'express';

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
    @Req() request: Request
  ) {
    return this.authService.refreshToken(
      context.req.user,
      request.signedCookies['refreshToken']
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
