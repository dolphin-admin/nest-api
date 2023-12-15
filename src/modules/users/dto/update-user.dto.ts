import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, NotContains } from 'class-validator'

import { I18nUtils } from '@/utils'

const { t } = I18nUtils

export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @MaxLength(50, { message: t('user.USERNAME.LENGTH') })
  @NotContains(' ', { message: t('user.USERNAME.NO.WHITESPACE') })
  @IsNotEmpty({ message: t('user.USERNAME.NOT.EMPTY') })
  username: string

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty()
  phoneNumber: string

  @IsNotEmpty()
  @ApiProperty({ description: '昵称' })
  nickName: string

  @IsNotEmpty()
  @ApiProperty({ description: '名' })
  firstName: string

  @IsNotEmpty()
  @ApiProperty({ description: '中间名' })
  middleName: string

  @IsNotEmpty()
  @ApiProperty({ description: '姓' })
  lastName: string

  @IsNotEmpty()
  @ApiProperty({ description: '头像' })
  avatarUrl: string

  @IsNotEmpty()
  @ApiProperty({ description: '性别' })
  gender: string

  @IsNotEmpty()
  @ApiProperty({ description: '国家' })
  country: string

  @IsNotEmpty()
  @ApiProperty({ description: '省份' })
  province: string

  @IsNotEmpty()
  @ApiProperty({ description: '城市' })
  city: string

  @IsNotEmpty()
  @ApiProperty({ description: '地址' })
  address: string

  @IsNotEmpty()
  @ApiProperty({ description: '个人简介' })
  biography: string

  @IsNotEmpty()
  @ApiProperty({ description: '个人网站' })
  website: string

  @IsNotEmpty()
  @ApiProperty({ description: '个人主页' })
  profile: string

  @IsNotEmpty()
  @ApiProperty({ description: '出生日期' })
  birthDate: Date

  @IsNotEmpty()
  @ApiProperty({ description: '是否启用' })
  enabled: boolean

  @IsNotEmpty()
  @ApiProperty({ description: '是否内置' })
  builtIn: boolean
}
