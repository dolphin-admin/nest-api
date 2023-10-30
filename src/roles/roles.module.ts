import { Module } from '@nestjs/common'

import { RolesController } from './roles.controller'
import { RolesGuard } from './roles.guard'
import { RolesService } from './roles.service'

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesGuard]
})
export class RolesModule {}
