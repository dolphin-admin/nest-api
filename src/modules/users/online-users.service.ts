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

  // 在线用户列表
  async findMany() {
    const pattern = this.cacheKeyService.getOnlineUserCacheKey('*')
    const cacheKeys = await this.redisService.keys(pattern)

    return this.redisService.mGetToJSON<UserVo>(cacheKeys)
  }
}
