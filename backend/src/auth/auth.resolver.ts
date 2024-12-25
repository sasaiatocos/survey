import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from 'src/users/dto/login-response.output';
import { Response } from 'express';

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
  async registerUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.authService.register(name, email, password);
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
