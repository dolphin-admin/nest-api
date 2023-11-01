import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UserTrafficRecordsController } from './user-traffic-records.controller'
import { UserTrafficRecordsService } from './user-traffic-records.service'

describe('UserTrafficRecordsController', () => {
  let controller: UserTrafficRecordsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTrafficRecordsController],
      providers: [UserTrafficRecordsService]
    }).compile()

    controller = module.get<UserTrafficRecordsController>(
      UserTrafficRecordsController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
