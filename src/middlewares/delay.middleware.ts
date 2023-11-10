import { Inject, Injectable, type NestMiddleware } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import type { NextFunction, Request, Response } from 'express'

import { AppConfig, DevConfig } from '@/configs'

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  constructor(
    @Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>,
    @Inject(DevConfig.KEY) private readonly devConfig: ConfigType<typeof DevConfig>
  ) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const { isDEV } = this.appConfig
    const { delaySeconds } = this.devConfig
    if (!isDEV) {
      next()
    } else {
      setTimeout(next, delaySeconds * 1000)
    }
  }
}
