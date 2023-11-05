import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Nodemailer 配置
export const NodemailerConfig = registerAs('nodemailer', () =>
  Object.freeze({
    host: env.NODEMAILER_HOST ?? '',
    port: env.NODEMAILER_PORT ? parseInt(env.NODEMAILER_PORT, 10) : 587,
    auth: {
      user: env.NODEMAILER_AUTH_USER ?? '',
      pass: env.NODEMAILER_AUTH_PASS ?? ''
    }
  })
)
