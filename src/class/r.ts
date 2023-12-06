import { ApiPropertyOptional } from '@nestjs/swagger'

import { BusinessCode } from '@/enums'

export class R<T = any> {
  @ApiPropertyOptional({ description: '业务代码', example: '000000' })
  code?: string

  @ApiPropertyOptional({ description: '提示信息', example: '请求成功' })
  msg?: string

  @ApiPropertyOptional({ description: '响应数据', type: () => Object })
  data?: T

  @ApiPropertyOptional({ description: '是否成功', example: true })
  success?: boolean

  @ApiPropertyOptional({
    description: '验证错误信息',
    example: ['用户名、密码不匹配'],
    type: [String]
  })
  errors?: string[]

  constructor(r?: R<T>) {
    const { code = BusinessCode.SUCCESS, msg = '', data, errors, success = true } = r ?? {}
    Object.assign(this, { code, msg, data, errors, success })
  }
}
