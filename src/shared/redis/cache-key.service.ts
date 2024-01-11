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
   * 字典缓存键
   */
  private readonly DICTIONARY_CACHE_KEY_PREFIX = 'dictionary'

  getDictionaryCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.DICTIONARY_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 字典项缓存键
   */
  private readonly DICTIONARY_ITEM_CACHE_KEY_PREFIX = 'dictionary_item'

  getDictionaryItemCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.DICTIONARY_ITEM_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 设置缓存键
   */
  private readonly SETTING_CACHE_KEY_PREFIX = 'setting'

  getSettingCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.SETTING_CACHE_KEY_PREFIX}:${pattern}`
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
