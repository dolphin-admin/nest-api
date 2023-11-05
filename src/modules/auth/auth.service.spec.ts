import { JwtModule } from '@nestjs/jwt'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UsersModule } from '@/modules/users/users.module'
import { PrismaModule } from '@/shared/prisma/prisma.module'

import { AuthService } from './auth.service'

describe('AuthService ', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule, PrismaModule],
      providers: [AuthService]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
