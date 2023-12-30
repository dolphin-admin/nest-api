import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import { BaseResource } from '@/class'

export class UserVo extends BaseResource {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '用户名' })
  username: string

  @ApiPropertyOptional({ description: '昵称', nullable: true })
  nickName?: string

  // 密码
  @ApiHideProperty()
  @Exclude()
  password: string

  @ApiPropertyOptional({ description: '邮箱', nullable: true })
  email?: string

  @ApiPropertyOptional({ description: '手机号', nullable: true })
  phoneNumber?: string

  @ApiPropertyOptional({ description: '名', nullable: true })
  firstName?: string

  @ApiPropertyOptional({ description: '中间名', nullable: true })
  middleName?: string

  @ApiPropertyOptional({ description: '姓', nullable: true })
  lastName?: string

  @ApiPropertyOptional({
    name: 'fullName',
    description: '全名',
    type: () => String,
    nullable: true
  })
  @Expose({ name: 'fullName' })
  getFullName(): string {
    return [this.firstName, this.middleName ?? '', this.lastName].filter((item) => item).join(' ')
  }

  @ApiPropertyOptional({ description: '头像', nullable: true })
  avatarUrl?: string

  @ApiPropertyOptional({ description: '性别', nullable: true })
  gender?: string

  @ApiPropertyOptional({ description: '国家', nullable: true })
  country?: string

  @ApiPropertyOptional({ description: '省份', nullable: true })
  province?: string

  @ApiPropertyOptional({ description: '城市', nullable: true })
  city?: string

  @ApiPropertyOptional({ description: '地址', nullable: true })
  address?: string

  @ApiPropertyOptional({ description: '个人简介', nullable: true })
  biography?: string

  @ApiPropertyOptional({ description: '个人网站', nullable: true })
  website?: string

  @ApiPropertyOptional({ description: '个人主页', nullable: true })
  profile?: string

  @ApiProperty({ description: '出生日期', nullable: true })
  birthDate?: Date

  @ApiProperty({ description: '是否启用' })
  enabled: boolean
}
