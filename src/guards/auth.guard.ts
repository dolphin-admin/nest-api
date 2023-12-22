import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import { I18nContext } from 'nestjs-i18n'

import { JwtConfig } from '@/configs'
import { SKIP_AUTH } from '@/constants'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { CustomRequest, JWTPayload } from '@/interfaces'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService,
    private readonly reflector: Reflector,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass()
    ])

    if (skipAuth) {
      return true
    }

    const request = context.switchToHttp().getRequest<CustomRequest>()
    const token = this.extractTokenFromHeader(request)
    const i18n = I18nContext.current<I18nTranslations>()!

    if (!token) {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }

    // 验证 jwt token
    let payload: JWTPayload
    try {
      payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: this.jwtConfig.secret
      })
      request.user = payload
    } catch {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }

    // 检查用户是否在线
    const cachedValue = await this.redisService.client.get(
      this.cacheKeyService.getOnlineUserCacheKey(payload.sub)
    )
    if (!cachedValue) {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
