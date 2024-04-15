import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostRequestDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postsService.getPost(id);
  }

  @Post()
  createPost(
    @Query('user-id') userId: number,
    @Body() postRequestDto: PostRequestDto,
  ) {
    this.postsService.createPost(postRequestDto, userId);
  }

  @Put('/:id')
  updatePost(@Param('id') id: number, @Body() postRequestDto: PostRequestDto) {
    this.postsService.updatePost(id, postRequestDto);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number) {
    this.postsService.deletePost(id);
  }
}
