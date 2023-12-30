import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

export const AppConfig = registerAs('app', () => {
  if (!env.APP_NAME) {
    throw new EnvUndefinedError('APP_NAME')
  }
  if (!env.APP_VERSION) {
    throw new EnvUndefinedError('APP_VERSION')
  }
  if (!env.APP_PORT) {
    throw new EnvUndefinedError('APP_PORT')
  }
  if (!env.APP_BASE_URL) {
    throw new EnvUndefinedError('APP_BASE_URL BASE_URL')
  }
  return Object.freeze({
    // App 元数据
    name: env.APP_NAME,
    version: env.APP_VERSION,
    port: parseInt(env.APP_PORT, 10),
    baseUrl: env.APP_BASE_URL,
    env: env.NODE_ENV ?? 'development',
    isDEV: env.NODE_ENV === 'development',
    isSTAGING: env.NODE_ENV === 'staging',
    isPROD: env.NODE_ENV === 'production'
  })
})
