import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class BaseResourceVo {
  @ApiProperty({ description: '创建时间' })
  createdAt: Date

  @ApiProperty({ description: '创建人', nullable: true })
  createdBy?: number

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date

  @ApiProperty({ description: '更新人', nullable: true })
  updatedBy?: number

  @ApiHideProperty()
  @Exclude()
  deletedAt?: Date

  @ApiHideProperty()
  @Exclude()
  deletedBy?: number
}
