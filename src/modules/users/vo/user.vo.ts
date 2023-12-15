import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { BaseResource } from '@/class'

export class UserVo extends BaseResource {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '用户名' })
  username: string

  @ApiPropertyOptional({ description: '昵称' })
  nickName?: string

  // 密码
  @ApiHideProperty()
  @Exclude()
  password: string

  @ApiPropertyOptional({ description: '邮箱' })
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  phoneNumber?: string

  @ApiPropertyOptional({ description: '名' })
  firstName?: string

  @ApiPropertyOptional({ description: '中间名' })
  middleName?: string

  @ApiPropertyOptional({ description: '姓' })
  lastName?: string

  @ApiProperty({ description: '全名', type: () => String })
  @Expose({ name: 'fullName' })
  getFullName(): string {
    return [this.firstName, this.middleName ?? '', this.lastName].filter((item) => item).join(' ')
  }

  @ApiPropertyOptional({ description: '头像' })
  avatarUrl?: string

  @ApiPropertyOptional({ description: '性别' })
  gender?: string

  @ApiPropertyOptional({ description: '国家' })
  country?: string

  @ApiPropertyOptional({ description: '省份' })
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  city?: string

  @ApiPropertyOptional({ description: '地址' })
  address?: string

  @ApiPropertyOptional({ description: '个人简介' })
  biography?: string

  @ApiPropertyOptional({ description: '个人网站' })
  website?: string

  @ApiPropertyOptional({ description: '个人主页' })
  profile?: string

  @ApiProperty({ description: '出生日期' })
  birthDate?: Date

  @ApiProperty({ description: '是否启用' })
  enabled: boolean
}
