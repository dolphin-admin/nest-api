import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtConfig } from '@/configs'
import type { CustomRequest, JwtPayload } from '@/interfaces'
import { SessionService } from '@/shared/session/session.service'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly sessionService: SessionService,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshTokenSecret,
      passReqToCallback: true
    })
  }

  async validate(req: CustomRequest, jwtPayload: JwtPayload) {
    const sid = req.cookies.sid as string
    if (!sid) {
      return false
    }

    const session = await this.sessionService.getSession(sid)
    if (
      !session.refreshToken ||
      session.refreshToken !== ExtractJwt.fromUrlQueryParameter('token')(req)
    ) {
      return false
    }

    req.jwtPayload = jwtPayload

    return { ...jwtPayload }
  }
}
