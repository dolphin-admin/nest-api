import type { Type } from '@nestjs/common'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

interface Options {
  isArray?: boolean
}

export function ApiOkResponse<T extends Type>(type?: T, options?: Options) {
  return applyDecorators(
    ...(type ? [ApiExtraModels(type)] : []),
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
              ...(options?.isArray
                ? {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(type)
                    }
                  }
                : {
                    type: 'object',
                    $ref: getSchemaPath(type)
                  })
            }
          })
        }
      }
    })
  )
}
