import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiOkResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: '请求成功',
      schema: {
        properties: {
          msg: {
            type: 'string',
            description: '提示信息',
            example: ''
          }
        }
      }
    })
  )
}
