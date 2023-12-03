import { IsNotEmpty } from 'class-validator'

export class CreateNotificationDto {
  @IsNotEmpty()
  message: string

  @IsNotEmpty()
  userId: number
}
