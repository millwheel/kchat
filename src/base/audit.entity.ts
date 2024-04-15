import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTimeEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @BeforeInsert()
  prePersist() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  preUpdate() {
    this.updatedAt = new Date();
  }
}