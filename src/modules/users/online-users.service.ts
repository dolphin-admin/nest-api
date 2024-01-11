import { Injectable } from '@nestjs/common'

import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

import type { UserVo } from './vo'

@Injectable()
export class OnlineUsersService {
  constructor(
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService
  ) {}

  async create(userId: number, jti: string) {
    const cacheKey = this.cacheKeyService.getOnlineUserCacheKey(userId)
    await this.redisService.hSetObj(
      cacheKey,
      {
        userId,
        jti,
        lastActivityAt: new Date().toISOString()
      },
      this.redisService.ONLINE_USER_TTL
    )
  }

  async findMany() {
    const pattern = this.cacheKeyService.getOnlineUserCacheKey('*')
    const cacheKeys = await this.redisService.keys(pattern)
    const result = await this.redisService.mGetToJSON<UserVo>(cacheKeys)
    return result
  }

  async delete(userId: number) {
    const cacheKey = this.cacheKeyService.getOnlineUserCacheKey(userId)
    await this.redisService.del(cacheKey)
  }
}
