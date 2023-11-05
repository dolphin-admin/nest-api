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
    port: env.PORT ?? 3000,
    env: env.ENV ?? 'DEV',
    isDEV: env.ENV === 'DEV',
    isPROD: env.ENV === 'PROD',
    baseUrl: env.BASE_URL ?? 'http://localhost:3000'
  })
)
