import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUser, User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ name: dto.name, email: dto.email, passwordHash });
    const saved = await this.repo.save(user);
    return this.toPublic(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<PublicUser | null> {
    const user = await this.repo.findOne({ where: { id } });
    return user ? this.toPublic(user) : null;
  }

  private toPublic(user: User): PublicUser {
    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }
}
