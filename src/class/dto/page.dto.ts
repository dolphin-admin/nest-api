import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsOptional, IsPositive, IsString } from 'class-validator'

export class PageDto {
  @ApiProperty({ description: '页码', example: 1 })
  @IsPositive({ message: '页码必须大于 0' })
  page: number = 1

  @ApiProperty({ description: '每页条数', example: 10 })
  @IsPositive({ message: '每页条数必须大于 0' })
  pageSize: number = 10

  @ApiPropertyOptional({ description: '搜索关键字' })
  @IsString({ message: '搜索关键字必须是一个字符串' })
  @IsOptional()
  searchText?: string

  @ApiPropertyOptional({
    description: '开始时间',
    example: new Date(
      new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 7)
    ).toISOString()
  })
  @IsDate({ message: '开始时间必须是一个有效的日期字符串' })
  @IsOptional()
  startTime?: Date

  @ApiPropertyOptional({ description: '结束时间', example: new Date().toISOString() })
  @IsDate({ message: '结束时间必须是一个有效的日期字符串' })
  @IsOptional()
  endTime?: Date
}
