import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

// 根据状态码返回对应描述
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
        description: getDescription(description, status),
        schema: {
          properties: {
            code: {
              type: 'string',
              description: '业务代码'
            },
            message: {
              type: 'string',
              description: '提示信息'
            }
          }
        }
      })
    )
  }
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status,
      description: getDescription(description, status),
      schema: {
        title: `${type.name.replace('Vo', '')}ResponseVo`,
        properties: {
          code: {
            type: 'string',
            description: '业务代码'
          },
          message: {
            type: 'string',
            description: '提示信息'
          },
          data: {
            type: 'object',
            $ref: getSchemaPath(type)
          }
        }
      }
    })
  )
}
