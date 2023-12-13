import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsISO8601, IsOptional, IsPositive, IsString } from 'class-validator'

import { ToISOString, Trim } from '@/decorators'
import { SortColumnKey, SortOrder } from '@/enums'

export class PageDto {
  @ApiProperty({ description: '页码', example: 1, default: 1 })
  @IsPositive({ message: '页码必须大于 0' })
  page: number = 1

  @ApiProperty({ description: '每页条数', example: 10, default: 10 })
  @IsPositive({ message: '每页条数必须大于 0' })
  pageSize: number = 10

  @ApiPropertyOptional({ description: '搜索关键字' })
  @IsString({ message: '搜索关键字必须是一个字符串' })
  @IsOptional()
  @Trim()
  keywords?: string

  @ApiPropertyOptional({
    description: '开始时间',
    example: new Date(
      new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 7)
    ).toISOString()
  })
  @IsISO8601(
    {
      strict: true,
      strictSeparator: true
    },
    { message: '开始时间必须是一个有效的日期字符串' }
  )
  @IsOptional()
  @ToISOString()
  startTime?: string

  @ApiPropertyOptional({ description: '结束时间', example: new Date().toISOString() })
  @IsISO8601(
    {
      strict: true,
      strictSeparator: true
    },
    { message: '结束时间必须是一个有效的日期字符串' }
  )
  @IsOptional()
  @ToISOString()
  endTime?: string

  @ApiPropertyOptional({
    description: '排序列名',
    example: `${SortColumnKey.SORT},${SortColumnKey.CREATED_AT}`,
    default: SortColumnKey.CREATED_AT
  })
  @IsEnum(SortColumnKey, { each: true, message: '排序列名不支持' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  sortColumnKeys: SortColumnKey[]

  @ApiPropertyOptional({
    description: '排序方式',
    example: `${SortOrder.ASC},${SortOrder.DESC}`,
    default: SortOrder.DESC
  })
  @IsEnum(SortOrder, { each: true, message: '排序方法不支持' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  sortOrders: SortOrder[]

  orderBy?: Record<SortColumnKey, SortOrder>[]

  // 默认排序顺序为：排序字段升序（优先）、创建时间降序（次要）
  constructor() {
    this.sortColumnKeys = [SortColumnKey.SORT, SortColumnKey.CREATED_AT]
    this.sortOrders = [SortOrder.ASC, SortOrder.DESC]
    // 将排序字段和排序方式转化为 Prisma 的排序对象数组
    this.orderBy = this.sortColumnKeys.map((field: SortColumnKey, index) => ({
      [field]: this.sortOrders[index]
    })) as Record<SortColumnKey, SortOrder>[]
  }
}
