import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import ms from 'ms'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { JwtConfig } from '@/configs'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

import type { UserVo } from './vo'

@Injectable()
export class OnlineUsersService {
  constructor(
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService,
    private readonly i18nService: I18nService<I18nTranslations>,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  /**
   * 设置在线用户
   * @description
   * - 使用了 refreshTokenExp 作为 TTL
   * - refreshTokenExp 兼容 ms 格式
   * - Redis TTL 以秒为单位，故转化为秒
   *
   * @see https://github.com/vercel/ms
   */
  async setOnlineUser(id: number, user: UserVo) {
    await this.redisService.set(
      this.cacheKeyService.getOnlineUserCacheKey(id),
      JSON.stringify(user),
      ms(this.jwtConfig.refreshTokenExp) / 1000
    )
  }

  // 在线用户列表
  async findMany() {
    const cacheKeys = await this.redisService.client.keys(
      this.cacheKeyService.getOnlineUserCacheKey('*')
    )

    return (await this.redisService.client.mGet(cacheKeys))
      .filter((i) => i)
      .map<UserVo>((i) => JSON.parse(i!))
  }

  // 强制下线
  async remove(id: number) {
    const cacheKey = this.cacheKeyService.getOnlineUserCacheKey(id)

    if (!(await this.redisService.client.exists(cacheKey))) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }

    await this.redisService.client.del(cacheKey)
  }
}
