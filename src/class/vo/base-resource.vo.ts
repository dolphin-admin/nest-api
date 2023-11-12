import { ApiProperty } from '@nestjs/swagger'

export class BaseResourceVo {
  @ApiProperty({ description: '创建时间' })
  createdAt: Date

  @ApiProperty({ description: '创建人', nullable: true })
  createdBy?: number

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date

  @ApiProperty({ description: '更新人', nullable: true })
  updatedBy?: number

  @ApiProperty({ description: '删除时间', nullable: true })
  deletedAt?: Date

  @ApiProperty({ description: '删除人', nullable: true })
  deletedBy?: number
}
