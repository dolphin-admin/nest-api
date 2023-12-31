import { Injectable } from '@nestjs/common'

@Injectable()
export class CacheKeyService {
  /**
   * Jwt Metadata 缓存键
   */
  private readonly JWT_METADATA_CACHE_KEY_PREFIX = 'jwt_metadata'

  getJwtMetadataCacheKey(pattern: string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.JWT_METADATA_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 用户信息缓存键
   */
  private readonly USER_CACHE_KEY_PREFIX = 'user'

  getUserCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.USER_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 在线用户信息缓存键
   */
  private readonly ONLINE_USER_CACHE_KEY_PREFIX = 'online_user'

  getOnlineUserCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.ONLINE_USER_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 多语言资源缓存键
   */
  private readonly LOCALES_CACHE_KEY_PREFIX = 'locales'

  getLocalesCacheKey(pattern: string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.LOCALES_CACHE_KEY_PREFIX}:${pattern}`
  }
}
