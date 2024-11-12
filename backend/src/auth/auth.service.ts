import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from 'src/users/dto/login-user.input';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserInput } from 'src/users/dto/register-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async register(input: RegisterUserInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(input.password, salt);

    const newUser = this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async login(input: LoginUserInput): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(input.email);

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { name: user.name, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUserByToken(token: string): Promise<User | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return await this.userService.findOne(decoded.sub);
    } catch (error) {
      return null;
    }
  }
}
