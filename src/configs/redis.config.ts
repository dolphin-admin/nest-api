import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

// Redis 配置
export const RedisConfig = registerAs('mongo', () => {
  if (!env.REDIS_USERNAME) {
    throw new EnvUndefinedError('REDIS_USERNAME')
  }
  if (!env.REDIS_PASSWORD) {
    throw new EnvUndefinedError('REDIS_PASSWORD')
  }
  if (!env.REDIS_DATABASE) {
    throw new EnvUndefinedError('REDIS_DATABASE')
  }
  if (!env.REDIS_HOST) {
    throw new EnvUndefinedError('REDIS_HOST')
  }
  if (!env.REDIS_PORT) {
    throw new EnvUndefinedError('REDIS_PORT')
  }
  return Object.freeze({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DATABASE,
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10)
  })
})
