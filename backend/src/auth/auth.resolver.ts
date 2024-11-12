import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from 'src/users/dto/login-response.output';
import { RegisterUserInput } from 'src/users/dto/register-user.input';
import { LoginUserInput } from 'src/users/dto/login-user.input';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => User)
  async registerUser(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('input') input: LoginUserInput,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    const { accessToken } = await this.authService.login(input);
    context.res.cookie('jwt', accessToken, { httpOnly: true });
    return { accessToken };
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: { res: Response }): Promise<boolean> {
    context.res.clearCookie('jwt');
    return true;
  }
}
