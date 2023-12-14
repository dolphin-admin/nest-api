import { ApiPropertyOptional } from '@nestjs/swagger'

export class BaseResponseVo<T = any> {
  @ApiPropertyOptional({ description: '提示信息', example: '请求成功' })
  msg?: string

  @ApiPropertyOptional({ description: '响应数据', type: () => Object })
  data?: T

  constructor(baseResponseVo?: BaseResponseVo<T>) {
    Object.assign(this, baseResponseVo)
  }
}
