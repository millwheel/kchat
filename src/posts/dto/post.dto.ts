import { IsString } from 'class-validator';

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
}
