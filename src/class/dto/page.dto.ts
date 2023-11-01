import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsPositive, IsString } from 'class-validator'

export class PageDto {
  @ApiProperty({ description: '页码' })
  @IsPositive({ message: '页码必须大于 0' })
  page: number

  @ApiProperty({ description: '每页条数' })
  @IsPositive({ message: '每页条数必须大于 0' })
  pageSize: number

  @ApiPropertyOptional({ description: '搜索关键字' })
  @IsString()
  @IsOptional()
  searchText?: string
}
