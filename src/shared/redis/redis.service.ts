import type { OnModuleDestroy } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

import { REDIS_CLIENT } from '@/constants'

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}

  readonly DATA_DEFAULT_TTL = 60 * 60

  async get(key: string) {
    const result = await this.redisClient.get(key)
    return result
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 是否存在缓存
  async exists(key: string) {
    return !!(await this.redisClient.exists(key))
  }

  // 设置 TTL
  async expire(key: string, ttl: number) {
    await this.redisClient.expire(key, ttl)
  }

  // 删除缓存
  async del(key: string | string[]) {
    await this.redisClient.del(key)
  }

  // 获取缓存 keys
  async keys(pattern: string) {
    const result = await this.redisClient.keys(pattern)
    return result
  }

  // 批量获取缓存
  async mGet(keys: string[]) {
    const result = await this.redisClient.mGet(keys)
    return result
  }

  // 批量获取 JSON 缓存
  async mGetToJSON<T>(keys: string[]): Promise<T[]> {
    const values = await this.redisClient.mGet(keys)
    return values.map((i) => (i ? JSON.parse(i) : null))
  }

  // 设置 JSON 缓存
  async jsonSet(key: string, value: any, ttl?: number) {
    await this.redisClient.set(key, JSON.stringify(value))

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 获取 JSON 缓存
  async jsonGet<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key)
    return value ? JSON.parse(value) : null
  }

  // 获取 Hash 缓存
  async hGet<T>(key: string, field: string): Promise<T | null> {
    const result = await this.redisClient.hGet(key, field)
    return result ? JSON.parse(result) : null
  }

  // 设置 Hash 缓存
  async hSet(key: string, field: string, value: unknown) {
    await this.redisClient.hSet(key, field, JSON.stringify(value))
  }

  // 删除 Hash 缓存
  async hDel(key: string, field: string) {
    await this.redisClient.hDel(key, field)
  }

  // 获取 Hash 对象缓存
  async hGetAll<T>(key: string): Promise<T | null> {
    if (!(await this.exists(key))) {
      return null
    }
    const result = await this.redisClient.hGetAll(key)

    const parsedResult: Record<string, unknown> = {}

    Object.entries(result).forEach(([field, value]) => {
      parsedResult[field] = JSON.parse(value)
    })

    return parsedResult as T
  }

  // 设置 Hash 对象缓存
  async hSetObj(key: string, obj: Record<string, unknown>, ttl?: number) {
    const hSetPromises = Object.keys(obj).map((field) =>
      this.redisClient.hSet(key, field, JSON.stringify(obj[field]))
    )

    await Promise.all(hSetPromises)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 设置 Set 缓存
  async sAdd(key: string, value: string) {
    await this.redisClient.sAdd(key, value)
  }

  // 获取 Set 缓存
  async sMembers(key: string) {
    const result = await this.redisClient.sMembers(key)
    return result
  }

  // 判断 Set 缓存是否存在
  async sIsMember(key: string, value: string) {
    return !!(await this.redisClient.sIsMember(key, value))
  }

  // 删除 Set 缓存
  async sRem(key: string, value: string) {
    await this.redisClient.sRem(key, value)
  }

  // 获取 Set 缓存长度
  async sCard(key: string) {
    const result = await this.redisClient.sCard(key)
    return result
  }

  // 关闭连接
  async onModuleDestroy() {
    await this.redisClient.quit()
  }
}
