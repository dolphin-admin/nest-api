import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { Page } from '@/class'

// 分页响应
export const ApiPageResponse = <T extends Type<unknown>>(type: T) =>
  applyDecorators(
    ApiExtraModels(Page, type),
    ApiOkResponse({
      schema: {
        description: '分页数据',
        allOf: [
          {
            $ref: getSchemaPath(Page)
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
