import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import type { Transporter } from 'nodemailer'
import { createTransport } from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'

import { AppConfig, NodemailerConfig } from '@/configs'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
    @Inject(NodemailerConfig.KEY) private nodemailerConfig: ConfigType<typeof NodemailerConfig>
  ) {
    const { host, port, auth } = nodemailerConfig
    const { user, pass } = auth
    this.transporter = createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass
      }
    })
  }

  async sendMail(options: Mail.Options) {
    await this.transporter.sendMail({
      ...options,
      from: {
        name: this.appConfig.name,
        address: this.nodemailerConfig.auth.user
      }
    })
  }
}
