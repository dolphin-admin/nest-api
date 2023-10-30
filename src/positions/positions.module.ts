import { Module } from '@nestjs/common'

import { PositionsController } from './positions.controller'
import { PositionsService } from './positions.service'

@Module({
  controllers: [PositionsController],
  providers: [PositionsService]
})
export class PositionsModule {}
