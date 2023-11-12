import { Injectable } from '@nestjs/common'

import type { CreateUserSettingDto } from './dto/create-user-setting.dto'
import type { UpdateUserSettingDto } from './dto/update-user-setting.dto'

@Injectable()
export class UserSettingsService {
  create(createUserSettingDto: CreateUserSettingDto) {
    return `This action adds a new userSetting${createUserSettingDto}`
  }

  findAll() {
    return 'This action returns all userSettings'
  }

  findOne(id: number) {
    return `This action returns a #${id} userSetting`
  }

  update(id: number, updateUserSettingDto: UpdateUserSettingDto) {
    return `This action updates a #${id} userSetting ${updateUserSettingDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} userSetting`
  }
}
