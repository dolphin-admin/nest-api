import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

import type { CustomRequest, JwtPayload } from '@/interfaces'

/**
 * jwt 信息装饰器
 * @description 用于获取当前请求执行上下文中的 jwtPayload
 */
export const Jwt = createParamDecorator<keyof JwtPayload>((key, ctx: ExecutionContext) => {
  const { jwtPayload } = ctx.switchToHttp().getRequest<CustomRequest>()
  return key ? jwtPayload?.[key] ?? null : jwtPayload
})
