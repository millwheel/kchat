import { Injectable } from '@nestjs/common';
import { User } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username: username },
    });
  }

  async save(user: User): Promise<any> {
    return await this.userRepository.save(user);
  }

  async delete(username: string): Promise<any> {
    await this.userRepository.delete({ username: username });
  }
}
