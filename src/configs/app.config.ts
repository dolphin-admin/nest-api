import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

export const AppConfig = registerAs('app', () =>
  Object.freeze({
    // App 元数据
    name: 'Dolphin Admin Nest',
    version: env.VERSION ?? '',
    author: 'Bruce Song',
    githubUrl: 'https://github.com/bit-ocean-studio/dolphin-admin-nest',
    team: {
      name: 'Bit Ocean',
      githubUrl: 'https://github.com/bit-ocean-studio'
    },
    // App 配置
    port: env.PORT ? parseInt(env.PORT, 10) : 3000,
    env: env.NODE_ENV ?? 'development',
    isDEV: env.NODE_ENV === 'development',
    isStaging: env.NODE_ENV === 'staging',
    isPROD: env.NODE_ENV === 'production',
    baseUrl: env.BASE_URL ?? 'http://localhost:3000'
  })
)
