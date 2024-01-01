import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtConfig } from '@/configs'
import type { CustomRequest, JwtPayload } from '@/interfaces'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService,
    @Inject(JwtConfig.KEY) readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshTokenSecret,
      passReqToCallback: true
    })
  }

  async validate(req: CustomRequest, jwtPayload: JwtPayload) {
    if (!jwtPayload.jti) {
      return false
    }

    const cacheKey = this.cacheKeyService.getJwtMetadataCacheKey(jwtPayload.jti)
    if (!(await this.redisService.exists(cacheKey))) {
      return false
    }

    req.jwtPayload = jwtPayload

    return jwtPayload
  }
}
