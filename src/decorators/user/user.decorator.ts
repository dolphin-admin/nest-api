import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

import type { CustomRequest, JWTPayload } from '../../interfaces'

/**
 * 用户信息装饰器
 * @description 用于获取当前请求执行上下文中的用户信息
 */
export const User = createParamDecorator<keyof JWTPayload>((key, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<CustomRequest>()
  return key ? user?.[key] ?? null : user
})
