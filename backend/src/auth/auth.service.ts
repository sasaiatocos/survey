import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/auth/common/constants';
import { comparePassword } from 'src/auth/common/helper';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

type PasswordOmitUser = Omit<User, 'password'>;

export interface JwtPayload {
  email: string;
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async login(user: PasswordOmitUser) {
    const payload: JwtPayload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user
    };
  }
}
