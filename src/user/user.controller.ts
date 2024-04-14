import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getAll() {
    return 'All users';
  }

  @Get('/:id')
  getOne() {
    return 'This will return one user';
  }
}
