import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

import { PageDto } from '@/class'
import { ToId, Trim } from '@/decorators'
import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class PageUserSettingDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber({}, { message: t('common.ID.INVALID') })
  @IsOptional()
  @ToId()
  id?: number

  @ApiPropertyOptional({ description: '键' })
  @IsString({ message: t('common.KEY.INVALID') })
  @IsOptional()
  @Trim()
  key?: string

  @ApiPropertyOptional({ description: '值' })
  @IsString({ message: t('common.VALUE.INVALID') })
  @IsOptional()
  @Trim()
  value?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsOptional()
  enabled?: boolean

  @ApiPropertyOptional({ description: '是否内置' })
  @IsBoolean({ message: t('common.BUILT.IN.INVALID') })
  @IsOptional()
  builtIn?: boolean

  @ApiPropertyOptional({ description: '用户 ID' })
  @IsNumber({}, { message: t('user.ID.INVALID') })
  @IsOptional()
  @ToId()
  userId?: number
}
