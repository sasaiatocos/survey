import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/auth/common/constants';
import { comparePassword, hashPassword } from 'src/auth/common/helper';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthResponse } from './dto/auth.response';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const findUserData = await this.userRepository.findOne({
      where: { email },
    });
    if (!findUserData) {
      throw new NotFoundException(constant.EMAIL_NOT_FOUND);
    }
    const IsValidPassword = await comparePassword(
      password,
      findUserData.password,
    );
    if (!IsValidPassword) {
      throw new BadGatewayException(constant.PROVIDED_WRONG_PASSWORD);
    }
    delete findUserData.password;
    return findUserData;
  }

  async login(user: User): Promise<AuthResponse> {
    const tokens = await this.getTokens(user);
    await this.updateHashedRefreshToken(user, tokens.refreshToken);
    return {
      ...tokens,
      user: user,
    }
  }

  async getTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = { email: user.email, id: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(
    user: User,
    authorization: string,
  ): Promise<AuthResponse> {
    const refreshToken = authorization.replace('Bearer', '').trim();
    if (!bcrypt.compareSync(refreshToken, user.hashedRefreshToken)) {
      throw new UnauthorizedException();
    };
    const tokens = await this.getTokens(user);
    await this.updateHashedRefreshToken(user, tokens.refreshToken);
    return {
      ...tokens,
      user: user,
    };
  }

  async updateHashedRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
    const userData = await this.userRepository.findOne(
      { where: { id: user.id } }
    );
    await this.userService.update(userData.id, hashedRefreshToken);
  }

  async logout(user: User): Promise<boolean> {
    const userId = await this.userRepository.findOne(
      { where: { id: user.id } }
    );
    const data = userId!.hashedRefreshToken = null
    await this.userRepository.save({
      id: userId.id,
      data
    });
    return true;
  }
}
