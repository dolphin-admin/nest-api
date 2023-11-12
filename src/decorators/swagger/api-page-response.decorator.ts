import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { PageVo } from '@/class'

// 分页响应
export const ApiPageResponse = <T extends Type<unknown>>(type: T) =>
  applyDecorators(
    ApiExtraModels(PageVo, type),
    ApiOkResponse({
      schema: {
        title: `${type.name.replace('Vo', '')}PageVo`,
        description: '分页数据',
        allOf: [
          {
            $ref: getSchemaPath(PageVo)
          },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(type)
                }
              }
            }
          }
        ]
      }
    })
  )
