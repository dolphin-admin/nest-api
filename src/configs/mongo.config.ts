import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// MongoDB 配置
export const MongoConfig = registerAs('mongo', () =>
  Object.freeze({
    user: env.MONGO_USERNAME ?? 'mongo',
    password: env.MONGO_PASSWORD ?? '',
    db: env.MONGO_DATABASE ?? 'dolphin-admin-mongo',
    host: env.MONGO_HOST ?? 'localhost',
    port: env.MONGO_PORT ? parseInt(env.MONGO_PORT, 10) : 27017,
    url: env.MONGO_URL
  })
)
