import { IsString } from 'class-validator';
import { Comment } from '../entity/comment.entity';

export class PostRequestDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}

export class PostResponseDto {
  title: string;
  content: string;
  userId: number;
  comments: Comment[];
}
