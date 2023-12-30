import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '@/modules/users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
