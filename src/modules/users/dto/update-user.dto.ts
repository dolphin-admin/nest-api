import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  NotContains
} from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @Length(4, 16, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsString({ message: t('user.USERNAME.INVALID') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  username: string

  @ApiPropertyOptional({ description: '昵称' })
  @MaxLength(16, { message: t('user.NICK.NAME.LENGTH') })
  @IsString({ message: t('user.NICK.NAME.INVALID') })
  @IsOptional()
  nickName?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @MaxLength(50, { message: t('user.EMAIL.LENGTH') })
  @IsEmail(undefined, { message: t('user.EMAIL.INVALID') })
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @MaxLength(25, { message: t('user.PHONE.NUMBER.LENGTH') })
  @IsPhoneNumber(undefined, { message: t('user.PHONE.NUMBER.INVALID') })
  @IsOptional()
  phoneNumber?: string

  @ApiPropertyOptional({ description: '名' })
  @MaxLength(10, { message: t('user.FIRST.NAME.INVALID') })
  @IsString({ message: t('user.FIRST.NAME.INVALID') })
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional({ description: '中间名' })
  @MaxLength(10, { message: t('user.MIDDLE.NAME.INVALID') })
  @IsString({ message: t('user.MIDDLE.NAME.INVALID') })
  @IsOptional()
  middleName?: string

  @ApiPropertyOptional({ description: '姓' })
  @MaxLength(10, { message: t('user.LAST.NAME.INVALID') })
  @IsString({ message: t('user.LAST.NAME.INVALID') })
  @IsOptional()
  lastName?: string

  @ApiPropertyOptional({ description: '头像' })
  @MaxLength(100, { message: t('user.AVATAR.URL.LENGTH') })
  @IsUrl(undefined, { message: t('user.AVATAR.URL.INVALID') })
  @IsOptional()
  avatarUrl?: string

  @ApiPropertyOptional({ description: '性别' })
  @MaxLength(10, { message: t('user.GENDER.LENGTH') })
  @IsString({ message: t('user.GENDER.INVALID') })
  @IsOptional()
  gender?: string

  @ApiPropertyOptional({ description: '国家' })
  @MaxLength(25, { message: t('user.COUNTRY.LENGTH') })
  @IsString({ message: t('user.COUNTRY.INVALID') })
  @IsOptional()
  country?: string

  @ApiPropertyOptional({ description: '省份' })
  @MaxLength(25, { message: t('user.PROVINCE.LENGTH') })
  @IsString({ message: t('user.PROVINCE.INVALID') })
  @IsOptional()
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  @MaxLength(25, { message: t('user.CITY.LENGTH') })
  @IsString({ message: t('user.CITY.INVALID') })
  @IsOptional()
  city?: string

  @ApiPropertyOptional({ description: '地址' })
  @MaxLength(100, { message: t('user.ADDRESS.LENGTH') })
  @IsString({ message: t('user.ADDRESS.INVALID') })
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ description: '个人简介' })
  @MaxLength(500, { message: t('user.BIOGRAPHY.LENGTH') })
  @IsString({ message: t('user.BIOGRAPHY.INVALID') })
  @IsOptional()
  biography?: string

  @ApiPropertyOptional({ description: '个人网站' })
  @MaxLength(50, { message: t('user.WEBSITE.LENGTH') })
  @IsUrl(undefined, { message: t('user.WEBSITE.INVALID') })
  @IsOptional()
  website?: string

  @ApiPropertyOptional({ description: '个人主页' })
  @MaxLength(50, { message: t('user.PROFILE.LENGTH') })
  @IsUrl(undefined, { message: t('user.PROFILE.INVALID') })
  @IsOptional()
  profile?: string

  @ApiPropertyOptional({ description: '出生日期' })
  @IsDate({ message: t('user.BIRTH.DATE.INVALID') })
  @IsOptional()
  birthDate?: Date

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: t('common.ENABLED.INVALID') })
  @IsOptional()
  enabled?: boolean
}
