import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { NotificationConsumer } from './notification.consumer'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification'
    })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationConsumer]
})
export class NotificationsModule {}
