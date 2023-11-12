import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { DevConfig } from '@/configs'

import type { CustomRequest } from '../interfaces'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(DevConfig.KEY) private readonly devConfig: ConfigType<typeof DevConfig>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { enableRequestLog } = this.devConfig
    if (!enableRequestLog) {
      return next.handle()
    }
    const request = context.switchToHttp().getRequest<CustomRequest>()
    console.log(`开始调用：${request.method}:${request.url}`)
    console.log('Request Queries:', request.query)
    console.log('Request Parameters:', request.params)
    console.log('Request Body:', request.body)

    const now = Date.now()
    return next
      .handle()
      .pipe(tap(() => console.log(`执行了 ${(Number(Date.now() - now) / 1000).toFixed(1)}s`)))
  }
}
