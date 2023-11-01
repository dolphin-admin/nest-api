import { Module } from '@nestjs/common'

import { UserTrafficRecordsController } from './user-traffic-records.controller'
import { UserTrafficRecordsService } from './user-traffic-records.service'

@Module({
  controllers: [UserTrafficRecordsController],
  providers: [UserTrafficRecordsService]
})
export class UserTrafficRecordsModule {}
