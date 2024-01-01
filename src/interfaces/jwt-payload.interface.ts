export interface JwtPayload {
  sub: number
  jti: string
  iat?: string
  exp?: string
}
