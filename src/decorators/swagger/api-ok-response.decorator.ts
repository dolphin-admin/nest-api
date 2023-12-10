import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse, getSchemaPath } from '@nestjs/swagger'

export function ApiOkResponse<T extends Type>(type?: T): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: '请求成功',
      schema: {
        properties: {
          msg: {
            type: 'string',
            description: '提示信息'
          },
          ...(type && {
            data: {
              type: 'object',
              $ref: getSchemaPath(type)
            }
          })
        }
      }
    })
  )
}
