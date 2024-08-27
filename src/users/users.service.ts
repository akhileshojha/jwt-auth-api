import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
  async create(username: string, password: string): Promise<User> {
    const user = new User();
    user.userId = this.users.length + 1;
    user.username = username;
    user.password = await bcrypt.hash(password, 10); // Hash password before storing

    this.users.push(user);
    return user;
  }
}