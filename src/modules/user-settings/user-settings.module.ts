import { Module } from '@nestjs/common'

import { UserSettingsController } from './user-settings.controller'
import { UserSettingsService } from './user-settings.service'

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService]
})
export class UserSettingsModule {}
