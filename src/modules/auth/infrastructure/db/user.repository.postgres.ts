import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma.service';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class UserRepositoryPostgres implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({ where: { email } });
    if (!userRecord) return null;
    return new User(
      userRecord.id,
      userRecord.name,
      userRecord.email,
      userRecord.role as any,
      userRecord.password,
      userRecord.createdAt,
    );
  }

  async save(user: User): Promise<User> {
    const savedRecord = await this.prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
    return new User(
      savedRecord.id,
      savedRecord.name,
      savedRecord.email,
      savedRecord.role as any,
      savedRecord.password,
      savedRecord.createdAt,
    );
  }
}
