import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

// MongoDB 配置
export const MongoConfig = registerAs('mongo', () => {
  if (!env.MONGO_USERNAME) {
    throw new EnvUndefinedError('MONGO_USERNAME')
  }
  if (!env.MONGO_PASSWORD) {
    throw new EnvUndefinedError('MONGO_PASSWORD')
  }
  if (!env.MONGO_DATABASE) {
    throw new EnvUndefinedError('MONGO_DATABASE')
  }
  if (!env.MONGO_HOST) {
    throw new EnvUndefinedError('MONGO_HOST')
  }
  if (!env.MONGO_PORT) {
    throw new EnvUndefinedError('MONGO_PORT')
  }
  if (!env.MONGO_URL) {
    throw new EnvUndefinedError('MONGO_URL')
  }
  return Object.freeze({
    user: env.MONGO_USERNAME,
    password: env.MONGO_PASSWORD,
    db: env.MONGO_DATABASE,
    host: env.MONGO_HOST,
    port: parseInt(env.MONGO_PORT, 10),
    url: env.MONGO_URL
  })
})
