import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { BaseTimeEntity } from '../../base/audit.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  writer: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  constructor(title: string, content: string, writer: User) {
    super(); // Assuming BaseTimeEntity needs to call super
    this.title = title;
    this.content = content;
    this.writer = writer;
  }
}
