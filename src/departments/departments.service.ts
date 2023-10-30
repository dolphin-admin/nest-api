import { Injectable } from '@nestjs/common'

import type { CreateDepartmentDto } from './dto/create-department.dto'
import type { UpdateDepartmentDto } from './dto/update-department.dto'

@Injectable()
export class DepartmentsService {
  create(createDepartmentDto: CreateDepartmentDto) {
    return createDepartmentDto
  }

  findAll() {
    return 'This action returns all departments'
  }

  findOne(id: number) {
    return `This action returns a #${id} department`
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return updateDepartmentDto
  }

  remove(id: number) {
    return `This action removes a #${id} department`
  }
}
