import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiCreatedResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '创建成功',
      schema: {
        properties: {
          msg: {
            type: 'string',
            description: '提示信息',
            example: '创建成功'
          }
        }
      }
    })
  )
}
