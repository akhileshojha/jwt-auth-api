import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body('username') username: string, @Body('password') password: string): Promise<User> {
    return this.usersService.create(username, password);
  }

  @Get(':username')
  async findUser(@Param('username') username: string): Promise<User | undefined> {
    return this.usersService.findOne(username);
  }
}