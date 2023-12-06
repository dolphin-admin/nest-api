import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

/**
 * Swagger 200 OK 响应
 */
export function ApiBaseOkResponse<T extends Type<unknown>>(
  type: T
): ReturnType<typeof applyDecorators>
export function ApiBaseOkResponse<T extends Type<unknown>>(options: {
  type: T
  description?: string
}): ReturnType<typeof applyDecorators>
export function ApiBaseOkResponse<T extends Type<unknown>>(
  typeOrOptions: T | { type: T; description?: string }
): ReturnType<typeof applyDecorators> {
  if (typeof typeOrOptions === 'object') {
    const { type, description } = typeOrOptions
    return applyDecorators(
      ApiExtraModels(type),
      ApiResponse({
        status: HttpStatus.OK,
        description: description ?? '请求成功',
        schema: {
          title: `${type.name.replace('Vo', '')}ResponseVo`,
          properties: {
            code: {
              type: 'string',
              description: '业务代码'
            },
            msg: {
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
  const type = typeOrOptions
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: '请求成功',
      schema: {
        properties: {
          code: {
            type: 'string',
            description: '业务代码'
          },
          msg: {
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
