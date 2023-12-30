export interface JwtPayload {
  sub: number
  username: string
  iat?: string
  exp?: string
}
