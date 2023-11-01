import { ApiProperty } from '@nestjs/swagger'

export class FileVo {
  @ApiProperty({ description: '文件路径' })
  path: string

  @ApiProperty({ description: '接口提交字段名称' })
  fieldname: string

  @ApiProperty({ description: '文件名称' })
  filename: string

  @ApiProperty({ description: '原始文件名称' })
  originalname: string

  @ApiProperty({ description: '媒体类型' })
  mimetype: string

  @ApiProperty({ description: '文件大小' })
  size: number

  constructor(partial: Partial<FileVo>) {
    Object.assign(this, partial)
  }
}
