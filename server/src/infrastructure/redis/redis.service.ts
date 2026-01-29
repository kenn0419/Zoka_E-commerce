import {
  Global,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Global()
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private client: RedisClientType;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const host = this.config.get('REDIS_HOST') || '127.0.0.1';
    const port = this.config.get('REDIS_PORT') || '6379';
    const password = this.config.get('REDIS_PASSWORD');

    const url = password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`;

    this.client = createClient({ url });

    await this.client.connect();

    this.logger.log('Redis connected (cache + socket pub/sub)');
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async sadd(key: string, value: string) {
    await this.client.sAdd(key, value);
  }

  async smembers(key: string) {
    return await this.client.sMembers(key);
  }

  get cacheClient() {
    return this.client;
  }

  async onModuleDestroy() {
    this.client.quit();
  }
}
