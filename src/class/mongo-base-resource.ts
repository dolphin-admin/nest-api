import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class MongoBaseResource {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: string

  @ApiProperty({ description: '创建时间' })
  @Expose()
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @Expose()
  updatedAt: Date

  @ApiProperty({ description: '排序' })
  @Expose()
  sort?: number
}
