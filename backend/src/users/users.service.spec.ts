import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOneByEmail', () => {
    it('should return a user when given a valid email', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null when given an invalid email', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getOneByEmail('invalid@example.com');
      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'invalid@example.com' } });
    });
  });

  describe('getOneById', () => {
    it('should return a user when given a valid id', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getOneById(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when given an invalid id', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getOneById(999);
      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });
});