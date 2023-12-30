import { Injectable } from '@nestjs/common'

@Injectable()
export class CacheKeyService {
  /**
   * 在线用户信息缓存键
   */
  private readonly ONLINE_USER_CACHE_KEY_PREFIX = 'online_user'

  getOnlineUserCacheKey(id: number | string) {
    if (!id) {
      throw new Error('ID is required!')
    }
    return `${this.ONLINE_USER_CACHE_KEY_PREFIX}:${id}`
  }

  /**
   * 多语言资源缓存键
   */
  private readonly LOCALES_CACHE_KEY_PREFIX = 'locales'

  getLocalesCacheKey(lang: string) {
    if (!lang) {
      throw new Error('Lang is required!')
    }
    return `${this.LOCALES_CACHE_KEY_PREFIX}:${lang}`
  }
}
