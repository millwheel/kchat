import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getAll() {
    return 'All users';
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return `User about :${id}`;
  }

  @Post()
  createUser() {
    return 'This creates new user';
  }

  @Put(':id')
  updateUser(@Param('id') id: string) {
    return `This update the user: ${id}`;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return `This deletes the user: ${id}`;
  }
}
