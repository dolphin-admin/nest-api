import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

export function ApiCreatedObjectResponse<T extends Type>(type: T) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '创建成功',
      schema: {
        properties: {
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
