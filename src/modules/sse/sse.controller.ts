import { Controller, Sse } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'

import { SkipAuth } from '@/decorators'

import { SseService } from './sse.service'

@ApiTags('SSE')
@ApiBasicAuth('bearer')
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
