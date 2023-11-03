import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ErrorResponseVo {
  @ApiProperty({ description: '响应状态码', example: 401 })
  readonly statusCode: number

  @ApiProperty({ description: '提示信息', example: '认证失败' })
  readonly message: string

  @ApiPropertyOptional({ description: '错误信息', example: 'Unauthorized' })
  readonly error: string
}
