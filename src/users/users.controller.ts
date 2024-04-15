import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/users.entity';
import { DeleteResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOne(username);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: User): Promise<User> {
    return await this.usersService.save(user);
  }

  @Delete(':username')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('username') username: string): Promise<DeleteResult> {
    return this.usersService.delete(username);
  }
}
