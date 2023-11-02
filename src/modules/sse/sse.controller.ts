import { Controller, Sse } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'

import { SkipAuth } from '@/decorators'

import { SseService } from './sse.service'

@SkipThrottle()
@SkipAuth()
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('notification')
  sendNotification() {
    return this.sseService.sendNotification()
  }
}
