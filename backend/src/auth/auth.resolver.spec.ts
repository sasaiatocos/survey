import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockUsersService = {
    getOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('registerUser', () => {
    it('should call authService.register with correct arguments', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const password = 'password';

      mockAuthService.register.mockResolvedValue(undefined);
      await authResolver.registerUser(name, email, password);

      expect(authService.register).toHaveBeenCalledWith(name, email, password);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct arguments and set cookie', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const accessToken = 'test_access_token';
      const context = { res: { cookie: jest.fn() } };

      mockAuthService.login.mockResolvedValue({ accessToken });

      await authResolver.login(email, password, context);

      expect(authService.login).toHaveBeenCalledWith(email, password);
      expect(context.res.cookie).toHaveBeenCalledWith('jwt', accessToken, { httpOnly: true });
    });
  });

  describe('logout', () => {
    it('should call context.res.clearCookie with correct arguments', async () => {
      const context = {
        res: {
          clearCookie: jest.fn(),
        } as Partial<Response>,
      };

      const result = await authResolver.logout(context as { res: Response });
      expect(result).toBe(true);
      expect(context.res.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });
});