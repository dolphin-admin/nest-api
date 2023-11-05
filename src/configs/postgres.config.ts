import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Postgres 配置
export const PostgresConfig = registerAs('postgres', () =>
  Object.freeze({
    user: env.POSTGRES_USER ?? 'postgres',
    password: env.POSTGRES_PASSWORD ?? '',
    db: env.POSTGRES_DB ?? 'dolphin-admin-postgres',
    host: env.POSTGRES_HOST ?? 'localhost',
    port: env.POSTGRES_PORT ? parseInt(env.POSTGRES_PORT, 10) : 5432,
    url: env.POSTGRES_URL
  })
)
