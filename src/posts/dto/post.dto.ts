import { IsString } from 'class-validator';

export class PostRequestDTO {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}

export class PostResponseDTO {
  title: string;
  content: string;
  userId: string;
}
