import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const { message, error, statusCode } = err?.response ?? {}
        console.log(`调用失败：${statusCode} ${error}`)
        console.log(`错误信息：${message}`)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => err)
      })
    )
  }
}
