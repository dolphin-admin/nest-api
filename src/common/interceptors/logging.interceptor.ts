import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import type { CustomRequest } from '../interfaces'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<CustomRequest>()
    console.log(`开始调用：${request.method}:${request.url}`)
    console.log('Request Queries:', request.query)
    console.log('Request Parameters:', request.params)
    console.log('Request Body:', request.body)

    const now = Date.now()
    return next
      .handle()
      .pipe(tap(() => console.log(`执行了 ${(Date.now() - now) / 1000}s`)))
  }
}
