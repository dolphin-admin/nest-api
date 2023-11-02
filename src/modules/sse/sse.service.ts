import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class SseService {
  sendNotification() {
    return new Observable((observer) => {
      observer.next({
        data: {
          message: 'Welcome to Dolphin Admin!'
        }
      })
      console.log('已发送数据')
      setTimeout(() => {
        observer.next({
          data: {
            message: '如果觉得不错，可以给个 🌟 哦！'
          }
        })
        console.log('已发送数据')
      }, 2000)
    })
  }
}
