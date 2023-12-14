import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiForbiddenResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { BaseResponseVo } from '@/class'

interface Option {
  status: HttpStatus
  description?: string
}

// 状态码 - 描述 Map
const statusCodeDescriptionMap = new Map<HttpStatus, string>([
  [HttpStatus.BAD_REQUEST, '输入有误'],
  [HttpStatus.UNAUTHORIZED, '认证失败'],
  [HttpStatus.FORBIDDEN, '权限不足'],
  [HttpStatus.NOT_FOUND, '资源不存在'],
  [HttpStatus.CONFLICT, '资源冲突'],
  [HttpStatus.NOT_IMPLEMENTED, '不支持该操作']
])

// 根据状态码或自定义对象返回需要应用的 Swagger 装饰器
const getDecorator = (option: HttpStatus | Option) => {
  if (typeof option === 'number') {
    return ApiResponse({
      status: option,
      description: statusCodeDescriptionMap.get(option),
      type: BaseResponseVo
    })
  }
  const { status, description } = option
  return ApiResponse({
    status,
    description: description ?? statusCodeDescriptionMap.get(status),
    type: BaseResponseVo
  })
}

// 错误响应装饰器，支持传递多个 HttpStatus 或自定义对象
export const ApiErrorResponse = (...options: (HttpStatus | Option)[]) => {
  const decorators: Parameters<typeof applyDecorators> = (options ?? []).map((option) =>
    getDecorator(option)
  )
  // 默认添加 401 和 403 的错误响应装饰器
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: statusCodeDescriptionMap.get(HttpStatus.UNAUTHORIZED),
      type: BaseResponseVo
    }),
    ApiForbiddenResponse({
      description: statusCodeDescriptionMap.get(HttpStatus.FORBIDDEN),
      type: BaseResponseVo
    }),
    ...decorators
  )
}
