import type { OnModuleDestroy } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

import { REDIS_CLIENT } from '@/constants'

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}

  client = this.redisClient

  // 设置缓存
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 关闭连接
  async onModuleDestroy() {
    await this.redisClient.quit()
  }
}
