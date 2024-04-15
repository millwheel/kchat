import { IsString } from 'class-validator';

export class CommentRequestDto {
  @IsString()
  readonly content: string;
}

export class CommentResponseDto {
  content: string;
  writerId: number;
  writerName: string;
}
