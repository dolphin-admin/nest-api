import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

export function ApiOkArrayResponse<T extends Type>(type: T) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: HttpStatus.OK,
      description: '请求成功',
      schema: {
        properties: {
          msg: {
            type: 'string',
            description: '提示信息',
            example: ''
          },
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(type)
            }
          }
        }
      }
    })
  )
}
