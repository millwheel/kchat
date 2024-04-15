import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { Repository } from 'typeorm';
import { PostRequestDto, PostResponseDto } from './dto/post.dto';
import { User } from '../users/entity/users.entity';
import { Comment } from './entity/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
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

  private async findCommentsByPost(post: Post): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: post },
    });
  }

  private mapPostToResponseDto(post: Post): PostResponseDto {
    const postResponseDto = new PostResponseDto();
    postResponseDto.title = post.title;
    postResponseDto.content = post.content;
    postResponseDto.userId = post.writer.id;
    return postResponseDto;
  }

  private mapCommentToResponseDto(
    postResponseDto: PostResponseDto,
    comments: Comment[],
  ): PostResponseDto {
    postResponseDto.comments = comments.map((comment) => ({
      content: comment.content,
      writerId: comment.writer.id,
      writerName: comment.writer.name,
    }));
    return postResponseDto;
  }

  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['writer'],
    });
    return posts.map(this.mapPostToResponseDto);
  }

  async getPost(postId: number): Promise<PostResponseDto> {
    const post = await this.findPostById(postId);
    const comments = await this.findCommentsByPost(post);
    const postResponseDto = this.mapPostToResponseDto(post);
    return this.mapCommentToResponseDto(postResponseDto, comments);
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
    const comments = await this.findCommentsByPost(saved);
    const postResponseDto = this.mapPostToResponseDto(post);
    return this.mapCommentToResponseDto(postResponseDto, comments);
  }

  async deletePost(postId: number): Promise<void> {
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
  }
}
