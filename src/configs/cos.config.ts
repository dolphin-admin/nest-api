import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// 腾讯云 COS 配置
export const CosConfig = registerAs('cos', () =>
  Object.freeze({
    secretId: env.COS_SECRET_ID ?? '', // 云 API 密钥 SecretId
    secretKey: env.COS_SECRET_KEY ?? '', // 云 API 密钥 SecretKey
    bucket: env.COS_BUCKET ?? '', // 存储桶名称
    region: env.COS_REGION ?? '' // 存储桶所在地区
  })
)
