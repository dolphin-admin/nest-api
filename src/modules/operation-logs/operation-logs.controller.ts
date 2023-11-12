import { Controller } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'

import { OperationLogsService } from './operation-logs.service'

@ApiTags('操作日志')
@ApiBasicAuth('bearer')
@Controller('operation-logs')
export class OperationLogsController {
  constructor(private readonly operationLogsService: OperationLogsService) {}
}
