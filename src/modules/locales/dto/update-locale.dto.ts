import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

import { I18nUtils } from '@/utils'

import { CreateLocaleDto } from './create-locale.dto'

const { t } = I18nUtils

export class UpdateLocaleDto extends PartialType(CreateLocaleDto) {
  @ApiProperty({ description: '排序' })
  @IsNumber({}, { message: t('common.SORT.INVALID') })
  @IsNotEmpty({ message: t('common.SORT.NOT.EMPTY') })
  sort: number
}
