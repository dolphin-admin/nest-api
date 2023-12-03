import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

import type { CreateNotificationDto } from './dto/create-notification.dto'
import type { UpdateNotificationDto } from './dto/update-notification.dto'

@Injectable()
export class NotificationsService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { message, userId } = createNotificationDto
    await this.notificationQueue.add('notification', { message, userId, type: 'notification' })
    return '发送成功'
  }

  findAll() {
    return 'This action returns all notifications'
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return updateNotificationDto
  }

  remove(id: number) {
    return `This action removes a #${id} notification`
  }
}
