import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { SseController } from './sse.controller'
import { SseService } from './sse.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification'
    })
  ],
  controllers: [SseController],
  providers: [SseService]
})
export class SseModule {}
