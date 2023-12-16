import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

import { PageDto } from '@/class'
import { ToId } from '@/decorators'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class PageDictionaryItemDto extends PageDto {
  @ApiPropertyOptional({ description: '字典项 ID' })
  @IsNumber({}, { message: t('common.ID.INVALID') })
  @IsOptional()
  @ToId()
  id?: number

  @ApiPropertyOptional({ description: '字典 ID' })
  @IsNumber({}, { message: t('common.ID.INVALID') })
  @IsOptional()
  @ToId()
  dictionaryId?: number

  @ApiPropertyOptional({ description: '字典项名称' })
  @IsString({ message: t('common.LABEL.INVALID') })
  @IsOptional()
  label?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsOptional()
  enabled?: boolean
}
