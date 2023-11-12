import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger'

import { PageDto } from '@/class/dto'

type QueryType = 'searchText' | 'date'

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
  if (type.includes('searchText')) {
    decorators.push(
      ApiQuery({
        name: 'searchText',
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
        example: new Date(
          new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 7)
        ).toISOString(),
        type: String
      }),
      ApiQuery({
        name: 'endTime',
        description: '结束时间',
        required: false,
        example: new Date().toISOString(),
        type: String
      })
    )
  }
  return applyDecorators(...decorators)
}
