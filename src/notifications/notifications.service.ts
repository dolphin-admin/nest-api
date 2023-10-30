import { Injectable } from '@nestjs/common'

import type { CreateNotificationDto } from './dto/create-notification.dto'
import type { UpdateNotificationDto } from './dto/update-notification.dto'

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    return createNotificationDto
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
