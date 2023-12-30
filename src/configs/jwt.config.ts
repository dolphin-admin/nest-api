import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

// JWT 配置
export const JwtConfig = registerAs('jwt', () => {
  if (!env.JWT_ACCESS_TOKEN_SECRET) {
    throw new EnvUndefinedError('JWT_ACCESS_TOKEN_SECRET')
  }
  if (!env.JWT_ACCESS_TOKEN_EXP) {
    throw new EnvUndefinedError('JWT_ACCESS_TOKEN_EXP')
  }
  if (!env.JWT_REFRESH_TOKEN_SECRET) {
    throw new EnvUndefinedError('JWT_REFRESH_TOKEN_SECRET')
  }
  if (!env.JWT_REFRESH_TOKEN_EXP) {
    throw new EnvUndefinedError('JWT_REFRESH_TOKEN_EXP')
  }
  return Object.freeze({
    accessTokenSecret: env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExp: env.JWT_ACCESS_TOKEN_EXP,
    refreshTokenSecret: env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExp: env.JWT_REFRESH_TOKEN_EXP
  })
})
