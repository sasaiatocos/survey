import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UsersService;

  const mockUserService = {
    getOneByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('user', () => {
    it('should return a user when given a valid email from CurrentUser', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (service.getOneByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await resolver.user(mockUser as User);
      expect(result).toEqual(mockUser);
      expect(service.getOneByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});