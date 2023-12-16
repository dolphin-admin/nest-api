import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { Page } from '@/class'

export const ApiPageOKResponse = <T extends Type>(type: T) =>
  applyDecorators(
    ApiExtraModels(Page, type),
    ApiOkResponse({
      schema: {
        description: '分页数据',
        allOf: [
          { $ref: getSchemaPath(Page) },
          {
            properties: {
              records: {
                type: 'array',
                description: '分页数据',
                items: { $ref: getSchemaPath(type) }
              }
            }
          }
        ]
      }
    })
  )
