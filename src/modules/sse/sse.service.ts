import { Injectable } from '@nestjs/common'
import { interval, map } from 'rxjs'

import type { NotificationMessageEventVo } from './vo'

@Injectable()
export class SseService {
  sendNotification() {
    return interval(2000).pipe(
      map<number, NotificationMessageEventVo>(() => ({
        data: { hello: 'world' },
        type: 'notification'
      }))
    )
  }
}
