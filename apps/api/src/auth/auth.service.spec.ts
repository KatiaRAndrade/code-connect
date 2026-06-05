import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const mockRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: JwtService, useValue: new JwtService({ secret: 'test-secret' }) },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  it('login retorna access_token com credenciais válidas', async () => {
    const passwordHash = await bcrypt.hash('senha123', 10);
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(
      { id: 1, name: 'Ana', email: 'ana@test.com', passwordHash } as User,
    );

    const result = await authService.login('ana@test.com', 'senha123');
    expect(result.access_token).toBeDefined();
    expect(typeof result.access_token).toBe('string');
  });

  it('login lança UnauthorizedException com senha errada', async () => {
    const passwordHash = await bcrypt.hash('senha123', 10);
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(
      { id: 1, name: 'Ana', email: 'ana@test.com', passwordHash } as User,
    );

    await expect(authService.login('ana@test.com', 'errada')).rejects.toThrow(UnauthorizedException);
  });

  it('login lança UnauthorizedException com email inexistente', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(authService.login('naoexiste@test.com', 'senha123')).rejects.toThrow(UnauthorizedException);
  });
});
