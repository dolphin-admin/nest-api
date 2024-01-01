import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

import { EnvUndefinedError } from '@/class'

// Nodemailer 配置
export const NodemailerConfig = registerAs('nodemailer', () => {
  if (!env.NODEMAILER_HOST) {
    throw new EnvUndefinedError('NODEMAILER_HOST')
  }
  if (!env.NODEMAILER_PORT) {
    throw new EnvUndefinedError('NODEMAILER_PORT')
  }
  if (!env.NODEMAILER_AUTH_USER) {
    throw new EnvUndefinedError('NODEMAILER_AUTH_USER')
  }
  if (!env.NODEMAILER_AUTH_PASS) {
    throw new EnvUndefinedError('NODEMAILER_AUTH_PASS')
  }
  return Object.freeze({
    host: env.NODEMAILER_HOST,
    port: parseInt(env.NODEMAILER_PORT, 10),
    auth: {
      user: env.NODEMAILER_AUTH_USER,
      pass: env.NODEMAILER_AUTH_PASS
    }
  })
})
