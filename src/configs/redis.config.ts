import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Redis 配置
export const RedisConfig = registerAs('mongo', () =>
  Object.freeze({
    username: env.REDIS_USERNAME ?? 'default',
    password: env.REDIS_PASSWORD ?? '',
    db: env.REDIS_DATABASE ?? 'dolphin-admin-redis',
    host: env.REDIS_HOST ?? 'localhost',
    port: env.REDIS_PORT ? parseInt(env.REDIS_PORT, 10) : 6379
  })
)
