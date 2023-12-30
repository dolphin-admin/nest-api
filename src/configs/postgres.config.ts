import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

// Postgres 配置
export const PostgresConfig = registerAs('postgres', () => {
  if (!env.POSTGRES_USER) {
    throw new EnvUndefinedError('POSTGRES_USER')
  }
  if (!env.POSTGRES_PASSWORD) {
    throw new EnvUndefinedError('POSTGRES_PASSWORD')
  }
  if (!env.POSTGRES_DB) {
    throw new EnvUndefinedError('POSTGRES_DB')
  }
  if (!env.POSTGRES_HOST) {
    throw new EnvUndefinedError('POSTGRES_HOST')
  }
  if (!env.POSTGRES_PORT) {
    throw new EnvUndefinedError('POSTGRES_PORT')
  }
  if (!env.POSTGRES_URL) {
    throw new EnvUndefinedError('POSTGRES_URL')
  }
  return Object.freeze({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    db: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT, 10),
    url: env.POSTGRES_URL
  })
})
