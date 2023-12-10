import { ApiProperty } from '@nestjs/swagger'

export class Page<T = any> {
  @ApiProperty({ description: '页码', example: 1 })
  page: number

  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number

  @ApiProperty({ description: '总条数', example: 100 })
  total: number

  @ApiProperty({ description: '分页数据', type: () => [Object] })
  records: T[] = []

  constructor(page?: Page<T>) {
    Object.assign(this, page)
  }
}
