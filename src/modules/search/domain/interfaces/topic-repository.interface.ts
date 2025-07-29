import { TopicEntity } from '../entities/topic.entity';

export interface ITopicRepository {
  findAll(limit: number, offset: number): Promise<TopicEntity[]>;
  count(): Promise<number>;
  findPopular(limit: number): Promise<TopicEntity[]>;
}
