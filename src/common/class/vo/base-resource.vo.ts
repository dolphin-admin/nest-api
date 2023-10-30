import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class BaseResourceVo {
  @ApiProperty({ description: '创建时间' })
  createdAt: Date

  @ApiHideProperty()
  @Exclude()
  createdBy?: string

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date

  @ApiHideProperty()
  @Exclude()
  updatedBy?: string

  @ApiHideProperty()
  @Exclude()
  deletedAt?: Date

  @ApiHideProperty()
  @Exclude()
  deletedBy?: string
}
