import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async login(@Args('authInput') authInput: AuthInput, @Context() context) {
    return await this.authService.login(context.user);
  }
}
