import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from 'src/users/dto/login-response.output';
import { RegisterUserInput } from 'src/users/dto/register-user.input';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  email: string;
  id: number;
  role: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  async registerUser(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context
  ): Promise<LoginResponse> {
    const { accessToken } = await this.authService.login(email, password);
    context.res.cookie('jwt', accessToken, { httpOnly: true });
    return { accessToken };
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: { res: Response }): Promise<boolean> {
    context.res.clearCookie('jwt');
    return true;
  }
}
