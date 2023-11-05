import { ConfigModule } from '@nestjs/config'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { CosController } from './cos.controller'
import { CosService } from './cos.service'

describe('CosController', () => {
  let controller: CosController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [CosController],
      providers: [CosService]
    }).compile()

    controller = module.get<CosController>(CosController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
