import { JwtService } from '@nestjs/jwt';
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { constant } from './common/constants';
import { comparePassword } from './common/helper';
import { LoginResponse } from 'src/users/dto/login-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async register(name: string, email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const findUserData = await this.userService.getOneByEmail(email);
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

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userService.getOneByEmail(email);
    const payload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
