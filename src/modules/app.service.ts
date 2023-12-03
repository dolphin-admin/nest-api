import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { AppConfig } from '@/configs'

@Injectable()
export class AppService {
  constructor(@Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>) {}

  getAppInfo() {
    return {
      name: this.appConfig.name,
      version: this.appConfig.version
    }
  }
}
