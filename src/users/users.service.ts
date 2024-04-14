import { Injectable } from '@nestjs/common';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }
}
