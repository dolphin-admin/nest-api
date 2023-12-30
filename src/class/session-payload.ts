export class SessionPayload {
  // Session ID
  sid: string

  // 访问令牌
  accessToken: string

  // 刷新令牌
  refreshToken: string

  // 用户 ID
  userId: number

  // 用户名
  username: string

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

  constructor(sessionPayload?: SessionPayload) {
    Object.assign(this, sessionPayload)
  }
}
