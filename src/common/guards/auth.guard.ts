import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import { I18nContext } from 'nestjs-i18n'

import { SKIP_AUTH } from '@/common/constants'
import type { CustomRequest } from '@/common/interfaces'
import type { I18nTranslations } from '@/generated/i18n.generated'

import type { JWTPayload } from '../interfaces'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector
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
    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      })
      request.user = payload
    } catch {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
