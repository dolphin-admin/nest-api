import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { CustomRequest } from '@/common/interfaces'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest<CustomRequest>()
    if (!user) {
      throw new ForbiddenException('授权失败')
    }
    if (user.roles?.some((role) => roles.includes(role))) {
      return true
    }
    throw new ForbiddenException('授权失败')
  }
}
