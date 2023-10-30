import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { PageResponseVo } from '@/common'

export const ApiPageResponse = <T extends Type<unknown>>(type?: T) => {
  if (!type) {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          title: 'PageResponse',
          description: '分页数据',
          allOf: [
            {
              $ref: getSchemaPath(PageResponseVo)
            },
            {
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          ]
        }
      })
    )
  }
  return applyDecorators(
    ApiExtraModels(PageResponseVo, type),
    ApiOkResponse({
      schema: {
        title: `${type.name}PageResponse`,
        description: '分页数据',
        allOf: [
          {
            $ref: getSchemaPath(PageResponseVo)
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
}
