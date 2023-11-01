import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { DictionaryItemsController } from './dictionary-items.controller'
import { DictionaryItemsService } from './dictionary-items.service'

describe('DictionaryItemsController', () => {
  let controller: DictionaryItemsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryItemsController],
      providers: [DictionaryItemsService]
    }).compile()

    controller = module.get<DictionaryItemsController>(
      DictionaryItemsController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
