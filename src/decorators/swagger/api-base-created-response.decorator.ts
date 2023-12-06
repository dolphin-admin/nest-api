import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger'

/**
 * Swagger 201 Created 响应
 * @param type 数据响应类型
 * @returns 返回 ApiExtraModels 和 ApiCreatedResponse 装饰器
 */
export function ApiBaseCreatedResponse<T extends Type<unknown>>(
  type?: T
): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ...(type ? [ApiExtraModels(type)] : []),
    ApiCreatedResponse({
      description: '创建成功',
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
