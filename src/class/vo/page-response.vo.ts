import { ApiProperty } from '@nestjs/swagger'

import { BaseResponseVo } from './base-response.vo'

export class PageResponseVo<T = any> extends BaseResponseVo<T> {
  @ApiProperty({ description: '页码', example: 1 })
  page: number

  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number

  @ApiProperty({ description: '总条数', example: 100 })
  total: number

  constructor(pageResponseVo?: PageResponseVo<T>) {
    const { code, message, data, ...pageRelateVo } = pageResponseVo ?? {}
    super({ code, message, data })
    Object.assign(this, pageRelateVo)
  }
}
