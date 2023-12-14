import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

import { I18nUtils } from '@/utils'

import { CreateLocaleDto } from './create-locale.dto'

const { t } = I18nUtils

export class UpdateLocaleDto extends PartialType(CreateLocaleDto) {
  @ApiPropertyOptional({ description: '排序' })
  @IsNumber({}, { message: t('common.SORT.INVALID') })
  @IsOptional()
  sort?: number
}
