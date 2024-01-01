export class JwtMetadata {
  // JWT ID
  jti: string

  // 用户 ID
  userId: number

  // 访问令牌
  accessToken: string

  // 刷新令牌
  refreshToken: string

  // IP
  ip?: string

  // 地区
  area?: string

  // 来源
  source?: string

  // 用户代理
  userAgent?: string

  // 浏览器
  browser?: string

  // 操作系统
  os?: string

  // 登录时间
  loginAt: string

  constructor(jwtMetadata?: JwtMetadata) {
    Object.assign(this, jwtMetadata)
  }
}
