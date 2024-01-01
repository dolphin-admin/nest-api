import type { ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { I18nContext } from 'nestjs-i18n'

import { SKIP_AUTH } from '@/constants'
import type { I18nTranslations } from '@/generated/i18n.generated'
import type { CustomRequest } from '@/interfaces'
import { OnlineUsersService } from '@/modules/users/online-users.service'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly onlineUserService: OnlineUsersService
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass()
    ])

    if (skipAuth) {
      return true
    }

    if (!(await super.canActivate(context))) {
      return false
    }

    const { sub, jti } = context.switchToHttp().getRequest<CustomRequest>().jwtPayload!
    this.onlineUserService.create(sub, jti)

    return true
  }

  handleRequest(err: any, jwtPayload: any) {
    if (err || !jwtPayload) {
      const i18n = I18nContext.current<I18nTranslations>()!
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return jwtPayload
  }
}
