import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { LoginLogsController } from './login-logs.controller'
import { LoginLogsService } from './login-logs.service'
import { LoginLog, LoginLogSchema } from './schemas'

@Module({
  imports: [MongooseModule.forFeature([{ name: LoginLog.name, schema: LoginLogSchema }])],
  controllers: [LoginLogsController],
  providers: [LoginLogsService]
})
export class LoginLogsModule {}
