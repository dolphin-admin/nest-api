import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// JWT 配置
export const JwtConfig = registerAs('jwt', () =>
  Object.freeze({
    secret: env.JWT_SECRET ?? 'dolphin-admin-nest',
    accessTokenExp: env.JWT_ACCESS_TOKEN_EXP ?? '5m',
    refreshTokenExp: env.JWT_REFRESH_TOKEN_EXP ?? '1d'
  })
)
