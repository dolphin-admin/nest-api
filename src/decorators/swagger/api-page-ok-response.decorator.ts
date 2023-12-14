import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { PageVo } from '@/class'

export const ApiPageOKResponse = <T extends Type>(type: T) =>
  applyDecorators(
    ApiExtraModels(PageVo, type),
    ApiOkResponse({
      schema: {
        description: '分页数据',
        allOf: [
          { $ref: getSchemaPath(PageVo) },
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
