import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { DeleteResult, Repository } from 'typeorm';
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

  async getPosts(): Promise<PostResponseDto[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: ['writer'],
    });
    return posts.map((post: Post) => {
      return {
        title: post.title,
        content: post.content,
        userId: post.writer.id,
      };
    });
  }

  async getPost(postId: number): Promise<PostResponseDto> {
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    return {
      title: post.title,
      content: post.content,
      userId: post.writer.id,
    };
  }

  async createPost(
    postRequestDto: PostRequestDto,
    userId: number,
  ): Promise<PostResponseDto> {
    const { title, content } = postRequestDto;
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });
    const post: Post = new Post(title, content, user);
    const saved: Post = await this.postRepository.save(post);
    return {
      title: saved.title,
      content: saved.content,
      userId: saved.writer.id,
    };
  }

  async updatePost(
    postId: number,
    postRequestDto: PostRequestDto,
  ): Promise<PostResponseDto> {
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
    post.title = postRequestDto.title;
    post.content = postRequestDto.content;
    const saved: Post = await this.postRepository.save(post);
    return {
      title: saved.title,
      content: saved.content,
      userId: saved.writer.id,
    };
  }

  async deletePost(postId: number): Promise<DeleteResult> {
    return this.postRepository.delete(postId);
  }
}
