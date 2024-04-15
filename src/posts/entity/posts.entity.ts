import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { BaseTimeEntity } from '../../base/audit.entity';

@Entity()
export class Post extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  writer: User;

  constructor(title: string, content: string, writer: User) {
    super(); // Assuming BaseTimeEntity needs to call super
    this.title = title;
    this.content = content;
    this.writer = writer;
  }
}
