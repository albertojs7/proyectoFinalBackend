import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
