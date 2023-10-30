import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import { BaseResponseVo } from '@/common'

const getDescription = (description?: string, status?: number) => {
  if (description) {
    return description
  }
  switch (status) {
    case HttpStatus.CREATED:
      return '创建成功'
    default:
      return '请求成功'
  }
}

export const ApiBaseResponse = <T extends Type<unknown>>(options?: {
  type?: T
  description?: string
  status?: HttpStatus
}) => {
  const { type, description, status = HttpStatus.OK } = options ?? {}
  if (!type) {
    return applyDecorators(
      ApiResponse({
        status,
        description: getDescription(description, status)
      })
    )
  }
  return applyDecorators(
    ApiExtraModels(BaseResponseVo, type),
    ApiResponse({
      status,
      description: getDescription(description, status),
      schema: {
        $ref: getSchemaPath(BaseResponseVo),
        properties: {
          data: {
            type: 'object',
            $ref: getSchemaPath(type)
          }
        }
      }
    })
  )
}
