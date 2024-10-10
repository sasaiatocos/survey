import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { Res, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthInput } from './dto/auth.dto';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('AuthInput') authInput: AuthInput,
    @Context() context,
    @Res() response: Response,
  ): Promise<{
    success: boolean;
  }> {
    return await this.authService.login(context.user, response);
  }
}
