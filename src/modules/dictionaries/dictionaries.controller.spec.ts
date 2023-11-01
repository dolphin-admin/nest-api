import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { DictionariesController } from './dictionaries.controller'
import { DictionariesService } from './dictionaries.service'

describe('DictionariesController', () => {
  let controller: DictionariesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionariesController],
      providers: [DictionariesService]
    }).compile()

    controller = module.get<DictionariesController>(DictionariesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
