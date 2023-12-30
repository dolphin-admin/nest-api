import type { ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { I18nContext } from 'nestjs-i18n'

import { SKIP_AUTH } from '@/constants'
import type { I18nTranslations } from '@/generated/i18n.generated'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass()
    ])

    if (skipAuth) {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest<JwtPayload>(err: any, jwtPayload: JwtPayload) {
    if (err || !jwtPayload) {
      const i18n = I18nContext.current<I18nTranslations>()!
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return jwtPayload
  }
}
