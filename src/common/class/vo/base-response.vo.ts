import { ApiPropertyOptional } from '@nestjs/swagger'

export class BaseResponseVo<T = any> {
  @ApiPropertyOptional({ description: '业务代码' })
  code?: string

  @ApiPropertyOptional({ description: '提示信息' })
  message?: string

  @ApiPropertyOptional({ description: '响应数据' })
  data?: T

  constructor(baseResponseVo?: BaseResponseVo<T>) {
    const { code, message = '请求成功', data } = baseResponseVo ?? {}
    this.code = code
    this.message = message
    this.data = data
  }
}
