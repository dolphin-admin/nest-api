import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger'

import { PageDto } from '@/class'

type QueryType = 'keywords' | 'date'

// 分页参数
export const ApiPageQuery = (...type: QueryType[]) => {
  const decorators = [
    ApiExtraModels(PageDto),
    ApiQuery({
      name: 'page',
      description: '页码',
      required: true,
      example: 1,
      type: Number
    }),
    ApiQuery({
      name: 'pageSize',
      description: '每页条数',
      required: true,
      example: 10,
      type: Number
    })
  ]
  if (type.includes('keywords')) {
    decorators.push(
      ApiQuery({
        name: 'keywords',
        description: '搜索关键字',
        required: false,
        type: String
      })
    )
  }
  if (type.includes('date')) {
    decorators.push(
      ApiQuery({
        name: 'startTime',
        description: '开始时间',
        required: false,
        type: String
      }),
      ApiQuery({
        name: 'endTime',
        description: '结束时间',
        required: false,
        type: String
      })
    )
  }
  return applyDecorators(...decorators)
}
