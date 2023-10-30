import { Injectable } from '@nestjs/common'

import type { CreateSettingDto } from './dto/create-setting.dto'
import type { UpdateSettingDto } from './dto/update-setting.dto'

@Injectable()
export class SettingsService {
  create(createSettingDto: CreateSettingDto) {
    return createSettingDto
  }

  findAll() {
    return 'This action returns all settings'
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return updateSettingDto
  }

  remove(id: number) {
    return `This action removes a #${id} setting`
  }
}
