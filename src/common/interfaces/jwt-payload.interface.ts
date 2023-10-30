export interface JWTPayload {
  sub: number
  username: string
  roles?: string[]
}
