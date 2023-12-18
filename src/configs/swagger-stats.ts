import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Swagger Stats 配置
export const SwaggerStatsConfig = registerAs('swagger-stats', () =>
  Object.freeze({
    username: env.SWAGGER_STATS_USERNAME ?? 'admin',
    password: env.SWAGGER_STATS_PASSWORD ?? ''
  })
)
