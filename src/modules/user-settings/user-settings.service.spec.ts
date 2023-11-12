import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { UserSettingsService } from './user-settings.service'

describe('UserSettingsService', () => {
  let service: UserSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingsService]
    }).compile()

    service = module.get<UserSettingsService>(UserSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
