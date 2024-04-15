import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  getPost(postId: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id: postId } });
  }

  createPost(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  async updatePost(
    postId: number,
    title: string,
    content: string,
  ): Promise<Post> {
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
    });
    post.title = title;
    post.content = content;
    return await this.postRepository.save(post);
  }

  deletePost(postId: number): Promise<DeleteResult> {
    return this.postRepository.delete(postId);
  }
}
