import { ApiProperty } from '@nestjs/swagger'

export class DictionarySelectItemVo {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '值' })
  value: string

  @ApiProperty({ description: '名称' })
  label: string
}
