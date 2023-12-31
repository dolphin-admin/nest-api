import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { I18nContext } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest<JwtPayload>(err: any, jwtPayload: JwtPayload) {
    if (err || !jwtPayload) {
      const i18n = I18nContext.current<I18nTranslations>()!
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return jwtPayload
  }
}
