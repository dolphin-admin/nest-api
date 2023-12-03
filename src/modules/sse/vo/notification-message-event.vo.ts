export class NotificationMessageEventVo {
  data: string | object

  id?: string

  type?: string

  retry?: number

  constructor(notificationMessageEventVo: NotificationMessageEventVo) {
    Object.assign(this, notificationMessageEventVo)
  }
}
