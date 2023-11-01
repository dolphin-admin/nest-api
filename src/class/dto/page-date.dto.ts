import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate } from 'class-validator'

import { PageDto } from './page.dto'

export class PageDateDto extends PageDto {
  @ApiPropertyOptional({ description: '开始时间' })
  @IsDate()
  @ApiPropertyOptional()
  startTime?: Date

  @ApiPropertyOptional({ description: '结束时间' })
  @IsDate()
  @ApiPropertyOptional()
  endTime?: Date
}
