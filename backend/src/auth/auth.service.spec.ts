import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException, BadGatewayException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mockedSalt'),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    getOneByEmail: jest.fn(),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User);

      const result = await authService.register('Test User', 'test@example.com', 'password123');

      expect(saveSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' } as User;

      jest.spyOn(usersService, 'getOneByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password123');

      expect(result).toHaveProperty('id');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockResolvedValue(null);

      await expect(authService.validateUser('test@example.com', 'password123'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadGatewayException if password is incorrect', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('correctPassword', 10),
      } as User);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.validateUser('test@example.com', 'wrongPassword'))
        .rejects.toThrow(BadGatewayException);
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockResolvedValue({
        id: 1, email: 'test@example.com'
      } as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token');

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('accessToken', 'mocked-jwt-token');
    });
  });
});