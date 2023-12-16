import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

import { PageDto } from '@/class'
import { ToId } from '@/decorators'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class PageUserDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber({}, { message: t('common.ID.INVALID') })
  @IsOptional()
  @ToId()
  id?: number

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsOptional()
  enabled?: boolean
}
