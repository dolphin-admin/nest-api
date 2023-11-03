import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate } from 'class-validator'

import { PageDto } from './page.dto'

export class PageDateDto extends PageDto {
  @ApiPropertyOptional({
    description: '开始时间',
    example: new Date(
      new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 7)
    ).toISOString()
  })
  @IsDate()
  @ApiPropertyOptional()
  startTime?: Date

  @ApiPropertyOptional({ description: '结束时间', example: new Date().toISOString() })
  @IsDate()
  @ApiPropertyOptional()
  endTime?: Date
}
