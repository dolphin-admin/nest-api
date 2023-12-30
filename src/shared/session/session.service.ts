import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import ms from 'ms'

import type { SessionPayload } from '@/class'
import { JwtConfig } from '@/configs'
import { GeneratorUtils } from '@/utils'

import { RedisService } from '../redis/redis.service'

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(JwtConfig.KEY) readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  private readonly SESSION_CACHE_KEY_PREFIX = 'sid'

  // 获取 Session
  async getSession(sid: string): Promise<SessionPayload> {
    return this.redisService.hGetAll(`${this.SESSION_CACHE_KEY_PREFIX}:${sid}`)
  }

  // 设置 Session
  async setSession(
    sid: string,
    value: Required<SessionPayload>,
    ttl: number = ms(this.jwtConfig.refreshTokenExp) / 1000
  ) {
    await this.redisService.hSetObj(
      `${this.SESSION_CACHE_KEY_PREFIX}:${sid || this.generateSid()}`,
      value,
      ttl
    )
    return sid
  }

  // 是否存在 Session
  async existsSession(sid: string) {
    return this.redisService.exists(`${this.SESSION_CACHE_KEY_PREFIX}:${sid}`)
  }

  // 更新 Session 字段
  async patchSessionField(sid: string, field: string, value: string) {
    await this.redisService.hSet(`${this.SESSION_CACHE_KEY_PREFIX}:${sid}`, field, value)
  }

  // 删除 Session
  async deleteSession(sid: string) {
    await this.redisService.del(`${this.SESSION_CACHE_KEY_PREFIX}:${sid}`)
  }

  // 更新 Session 中的 tokens
  async refreshSessionTokens(sid: string, accessToken: string, refreshToken: string) {
    await this.patchSessionField(sid, 'accessToken', accessToken)
    await this.patchSessionField(sid, 'refreshToken', refreshToken)

    // 重置 Session 过期时间
    await this.redisService.expire(
      `${this.SESSION_CACHE_KEY_PREFIX}:${sid}`,
      ms(this.jwtConfig.refreshTokenExp) / 1000
    )
  }

  // 生成 Session Id
  generateSid() {
    return GeneratorUtils.generateUuid()
  }
}
