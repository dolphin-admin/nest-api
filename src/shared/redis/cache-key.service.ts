import { Injectable } from '@nestjs/common'

@Injectable()
export class CacheKeyService {
  private readonly ONLINE_USER_CACHE_KEY = 'users:online'

  getOnlineUserCacheKey(id: number | string) {
    if (!id) {
      throw new Error('ID is required!')
    }
    return `${this.ONLINE_USER_CACHE_KEY}:${id}`
  }

  private readonly LOCALE_RESOURCES_CACHE_KEY = 'locales:resources'

  getLocaleResourcesCacheKey(lang: string) {
    if (!lang) {
      throw new Error('Lang is required!')
    }
    return `${this.LOCALE_RESOURCES_CACHE_KEY}:${lang}`
  }
}
