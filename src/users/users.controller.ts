import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    const userList = this.usersService.findAll();
    return Object.assign({
      data: userList,
      status: HttpStatus.OK,
    });
  }

  @Get('/:username')
  async getUser(@Param('username') username: string): Promise<User> {
    const user = this.usersService.findOne(username);
    return Object.assign({
      data: user,
      status: HttpStatus.OK,
    });
  }

  @Post()
  async createUser(@Body() user: User): Promise<string> {
    await this.usersService.save(user);
    return Object.assign({
      data: { ...user },
      status: HttpStatus.CREATED,
    });
  }

  @Delete(':username')
  async deleteUser(@Param('username') username: string): Promise<string> {
    await this.usersService.delete(username);
    return Object.assign({
      data: { username: username },
      status: HttpStatus.OK,
    });
  }
}
