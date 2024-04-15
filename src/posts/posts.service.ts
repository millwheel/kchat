import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { Repository } from 'typeorm';
import { PostRequestDto, PostResponseDto } from './dto/post.dto';
import { User } from '../users/entity/users.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async findPostById(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    return post;
  }

  private mapPostToResponseDto(post: Post): PostResponseDto {
    return {
      title: post.title,
      content: post.content,
      userId: post.writer.id,
      comments: post.comments,
    };
  }

  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['writer'],
    });
    return posts.map(this.mapPostToResponseDto);
  }

  async getPost(postId: number): Promise<PostResponseDto> {
    const post = await this.findPostById(postId);
    return this.mapPostToResponseDto(post);
  }

  async createPost(
    postRequestDto: PostRequestDto,
    userId: number,
  ): Promise<PostResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    const post = new Post(postRequestDto.title, postRequestDto.content, user);
    const saved = await this.postRepository.save(post);
    return this.mapPostToResponseDto(saved);
  }

  async updatePost(
    postId: number,
    postRequestDto: PostRequestDto,
  ): Promise<PostResponseDto> {
    const post = await this.findPostById(postId);
    post.title = postRequestDto.title;
    post.content = postRequestDto.content;
    const saved = await this.postRepository.save(post);
    return this.mapPostToResponseDto(saved);
  }

  async deletePost(postId: number): Promise<void> {
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
  }
}
