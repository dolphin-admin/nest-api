import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  UserTraffic,
  UserTrafficRecord,
  UserTrafficRecordSchema,
  UserTrafficSchema
} from './schemas'
import { UserTrafficsController } from './user-traffics.controller'
import { UserTrafficsService } from './user-traffics.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserTraffic.name, schema: UserTrafficSchema },
      { name: UserTrafficRecord.name, schema: UserTrafficRecordSchema }
    ])
  ],
  controllers: [UserTrafficsController],
  providers: [UserTrafficsService]
})
export class UserTrafficsModule {}
