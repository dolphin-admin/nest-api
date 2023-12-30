import type { OnModuleDestroy } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

import { REDIS_CLIENT } from '@/constants'

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}

  async get(key: string) {
    return this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 是否存在缓存
  async exists(key: string) {
    return !!this.redisClient.exists(key)
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
    return this.redisClient.keys(pattern)
  }

  // 批量获取缓存
  async mGet(keys: string[]) {
    return this.redisClient.mGet(keys)
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
  async jsonGet<T>(key: string): Promise<T> {
    const value = await this.redisClient.get(key)
    return value ? JSON.parse(value) : null
  }

  // 获取 Hash 缓存
  async hGet<T>(key: string, field: string): Promise<T> {
    return this.redisClient.hGet(key, field) as T
  }

  // 设置 Hash 缓存
  async hSet(key: string, field: string | number, value: any) {
    await this.redisClient.hSet(key, field, value)
  }

  // 删除 Hash 缓存
  async hDel(key: string, field: string) {
    await this.redisClient.hDel(key, field)
  }

  // 获取 Hash 对象缓存
  async hGetAll<T>(key: string): Promise<T> {
    return this.redisClient.hGetAll(key) as T
  }

  // 设置 Hash 对象缓存
  async hSetObj(key: string, obj: Record<string, string | number>, ttl?: number) {
    const hSetPromises = Object.keys(obj).map((field) =>
      this.redisClient.hSet(key, field, obj[field])
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
    return this.redisClient.sMembers(key)
  }

  // 判断 Set 缓存是否存在
  async sIsMember(key: string, value: string) {
    return this.redisClient.sIsMember(key, value)
  }

  // 删除 Set 缓存
  async sRem(key: string, value: string) {
    await this.redisClient.sRem(key, value)
  }

  // 获取 Set 缓存长度
  async sCard(key: string) {
    return this.redisClient.sCard(key)
  }

  // 关闭连接
  async onModuleDestroy() {
    await this.redisClient.quit()
  }
}
