import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

import type { CustomRequest, JWTPayload } from '../../interfaces'

export const User = createParamDecorator<keyof JWTPayload>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>()
    const { user } = request
    if (data) {
      return user?.[data]
    }
    return user
  }
)
