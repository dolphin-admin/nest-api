import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class PatchUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  username?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  phoneNumber?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  nickName?: string

  @ApiPropertyOptional({ description: '名' })
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional({ description: '中间名' })
  @IsOptional()
  middleName?: string

  @ApiPropertyOptional({ description: '姓' })
  @IsOptional()
  lastName?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  avatarUrl?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  gender?: string

  @ApiPropertyOptional({ description: '国家' })
  @IsOptional()
  country?: string

  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  city?: string

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ description: '个人简介' })
  @IsOptional()
  biography?: string

  @ApiPropertyOptional({ description: '个人网站' })
  @IsOptional()
  website?: string

  @ApiPropertyOptional({ description: '个人主页' })
  @IsOptional()
  profile?: string

  @ApiPropertyOptional({ description: '出生日期' })
  @IsOptional()
  birthDate?: Date

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  enabled: boolean

  @ApiPropertyOptional({ description: '是否内置' })
  @IsOptional()
  builtIn: boolean
}
