import { Injectable } from '@nestjs/common'

import type { CreateRoleDto } from './dto/create-role.dto'
import type { UpdateRoleDto } from './dto/update-role.dto'

@Injectable()
export class RolesService {
  create(createRoleDto: CreateRoleDto) {
    console.log(createRoleDto)
    return 'This action adds a new role'
  }

  findAll() {
    return 'This action returns all roles'
  }

  findOne(id: number) {
    return `This action returns a #${id} role`
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    console.log(updateRoleDto)
    return `This action updates a #${id} role`
  }

  remove(id: number) {
    return `This action removes a #${id} role`
  }
}
