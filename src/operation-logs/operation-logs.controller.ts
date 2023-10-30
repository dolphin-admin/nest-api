import { Controller } from '@nestjs/common'

import { OperationLogsService } from './operation-logs.service'

@Controller('operation-logs')
export class OperationLogsController {
  constructor(private readonly operationLogsService: OperationLogsService) {}
}
