import { ApiProperty } from '@nestjs/swagger'

import { BaseResponseVo } from './base-response.vo'

export class PageVo<T = any> extends BaseResponseVo {
  @ApiProperty({ description: '页码', example: 1 })
  page: number

  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number

  @ApiProperty({ description: '总条数', example: 100 })
  total: number

  @ApiProperty({ description: '分页数据', type: () => [Object] })
  data?: T[]

  constructor(pageVo?: PageVo<T>) {
    const { code, message, data, ...pageRelateVo } = pageVo ?? {}
    super({ code, message, data })
    Object.assign(this, pageRelateVo)
  }
}
