import { ApiPropertyOptional } from '@nestjs/swagger'

export class ErrorResponseVo {
  @ApiPropertyOptional({ description: '业务代码' })
  code?: string

  @ApiPropertyOptional({ description: '提示信息', example: '认证失败' })
  message?: string

  @ApiPropertyOptional({
    description: '验证错误信息',
    example: ['用户名、密码不匹配'],
    type: [String]
  })
  errors?: string[]

  constructor(errorResponseVo: Partial<ErrorResponseVo>) {
    const { code, message = '请求失败', errors } = errorResponseVo
    Object.assign(this, { code, message, errors })
  }
}
