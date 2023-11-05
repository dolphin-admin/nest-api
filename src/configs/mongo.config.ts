import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// MongoDB 配置
export const MongoConfig = registerAs('mongo', () =>
  Object.freeze({
    username: env.MONGO_USERNAME ?? 'mongo',
    password: env.MONGO_PASSWORD ?? '',
    host: env.MONGO_HOST ?? 'localhost',
    port: env.MONGO_PORT ? parseInt(env.MONGO_PORT, 10) : 27017,
    database: env.MONGO_DATABASE ?? 'dolphin-admin-mongo',
    url: env.MONGO_URL
  })
)
