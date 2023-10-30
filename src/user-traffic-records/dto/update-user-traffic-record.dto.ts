import { PartialType } from '@nestjs/swagger'

import { CreateUserTrafficRecordDto } from './create-user-traffic-record.dto'

export class UpdateUserTrafficRecordDto extends PartialType(
  CreateUserTrafficRecordDto
) {}
