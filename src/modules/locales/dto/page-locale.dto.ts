import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { PageDto } from '@/class'
import { Trim } from '@/decorators'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class PageLocaleDto extends PageDto {
  @ApiPropertyOptional({ description: '键' })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsOptional()
  @Trim()
  key?: string

  @ApiPropertyOptional({ description: '命名空间' })
  @IsString({ message: t('common.VALUE.INVALID') })
  @IsOptional()
  @Trim()
  ns?: string
}
