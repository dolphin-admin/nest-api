import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('notification')
export class NotificationConsumer {
  @Process('notification')
  handleSendNotification(job: Job) {
    console.log(job)
  }
}
