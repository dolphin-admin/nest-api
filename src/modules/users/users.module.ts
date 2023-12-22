import { Module } from '@nestjs/common'

import { OnlineUsersController } from './online-users.controller'
import { OnlineUsersService } from './online-users.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController, OnlineUsersController],
  providers: [UsersService, OnlineUsersService],
  exports: [UsersService, OnlineUsersService]
})
export class UsersModule {}
