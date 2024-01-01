import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// 开发配置
export const DevConfig = registerAs('dev', () =>
  Object.freeze({
    delaySeconds: env.DELAY_SECONDS ? parseInt(env.DELAY_SECONDS, 10) : 0,
    enableRequestLog: env.ENABLE_REQUEST_LOG === 'true',
    enablePrismaLog: env.ENABLE_PRISMA_LOG === 'true',
    enableSwagger: env.ENABLE_SWAGGER === 'true'
  })
)
