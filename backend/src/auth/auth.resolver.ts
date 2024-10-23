import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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
  async login(@Args('AuthInput') authInput: AuthInput, @Context() context) {
    const result = await this.authService.login(context.user);
    context.res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return this.authService.login(context.user);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Context() context) {
    return this.authService.refreshToken(
      context.req.user,
      context.req.headers.authorization,
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
