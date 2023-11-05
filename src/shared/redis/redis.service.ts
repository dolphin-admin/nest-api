import type { OnModuleDestroy } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

import { REDIS_CLIENT } from '@/constants'

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}

  // 获取缓存
  async get(key: string) {
    return this.redisClient.get(key)
  }

  // 设置缓存
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 删除缓存
  async delete(key: string) {
    await this.redisClient.del(key)
  }

  // 清空缓存
  async flush() {
    await this.redisClient.FLUSHALL()
  }

  // 关闭连接
  async onModuleDestroy() {
    await this.redisClient.quit()
  }
}
