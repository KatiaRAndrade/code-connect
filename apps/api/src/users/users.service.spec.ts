import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

const mockRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Pick<Repository<User>, 'findOne' | 'create' | 'save'>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('cria um usuário e retorna sem passwordHash', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue({ id: 1, name: 'João', email: 'joao@test.com', passwordHash: 'hash' } as User);
    repo.save.mockResolvedValue({ id: 1, name: 'João', email: 'joao@test.com', passwordHash: 'hash' } as User);

    const user = await service.create({ name: 'João', email: 'joao@test.com', password: '123456' });
    expect(user).toEqual({ id: 1, name: 'João', email: 'joao@test.com' });
    expect('passwordHash' in user).toBe(false);
  });

  it('lança ConflictException ao cadastrar email duplicado', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'João', email: 'joao@test.com', passwordHash: 'hash' } as User);

    await expect(
      service.create({ name: 'Outro', email: 'joao@test.com', password: '654321' }),
    ).rejects.toThrow(ConflictException);
  });

  it('findById retorna usuário sem passwordHash', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'Maria', email: 'maria@test.com', passwordHash: 'hash' } as User);

    const found = await service.findById(1);
    expect(found?.email).toBe('maria@test.com');
    expect(found && 'passwordHash' in found).toBe(false);
  });

  it('findByEmail retorna o user completo (com passwordHash)', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'Maria', email: 'maria@test.com', passwordHash: 'hash' } as User);

    const found = await service.findByEmail('maria@test.com');
    expect(found?.passwordHash).toBeDefined();
  });
});
