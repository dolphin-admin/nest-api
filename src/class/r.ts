import { ApiPropertyOptional } from '@nestjs/swagger'

export class R<T = any> {
  @ApiPropertyOptional({ description: '提示信息', example: '请求成功' })
  msg?: string

  @ApiPropertyOptional({ description: '响应数据', type: () => Object })
  data?: T

  @ApiPropertyOptional({
    description: '验证错误信息',
    example: ['用户名、密码不匹配'],
    type: [String]
  })
  errors?: string[]

  constructor(r?: R<T>) {
    const { msg = '', data, errors } = r ?? {}
    Object.assign(this, { msg, data, errors })
  }
}
