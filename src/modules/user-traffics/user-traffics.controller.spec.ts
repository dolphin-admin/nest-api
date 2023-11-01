import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UserTrafficsController } from './user-traffics.controller'
import { UserTrafficsService } from './user-traffics.service'

describe('UserTrafficsController', () => {
  let controller: UserTrafficsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTrafficsController],
      providers: [UserTrafficsService]
    }).compile()

    controller = module.get<UserTrafficsController>(UserTrafficsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
