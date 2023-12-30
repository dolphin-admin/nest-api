import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtConfig } from '@/configs'
import type { CustomRequest, JwtPayload } from '@/interfaces'
import { SessionService } from '@/shared/session/session.service'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly sessionService: SessionService,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.accessTokenSecret,
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
      !session.accessToken ||
      session.accessToken !== ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    ) {
      return false
    }

    req.jwtPayload = jwtPayload

    return { ...jwtPayload }
  }
}
