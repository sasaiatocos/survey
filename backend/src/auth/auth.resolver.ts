import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtService } from '@nestjs/jwt';
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
    const payload = { email: email, id: context.req.user['id'] };
    context.res.cookie('accessToken', this.jwtService.sign(payload), {
      maxAge: 3000000
    })
    return this.authService.login(
      context.req.user,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context) {
    context.res.cookie('accessToken', null, {
      maxAge: 0
    });
    return true;
  }
}
