import { PartialType } from '@nestjs/swagger'

import { CreateUserSettingDto } from './create-user-setting.dto'

export class UpdateUserSettingDto extends PartialType(CreateUserSettingDto) {}
