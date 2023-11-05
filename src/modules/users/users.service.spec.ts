import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { PrismaModule } from '@/providers/prisma/prisma.module'

import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService]
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
