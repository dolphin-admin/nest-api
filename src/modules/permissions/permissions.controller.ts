import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { PermissionsService } from './permissions.service'

@ApiTags('权限')
@ApiBasicAuth('bearer')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
}
