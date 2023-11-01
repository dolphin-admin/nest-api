import { Injectable } from '@nestjs/common'

import type { CreateUserTrafficRecordDto } from './dto/create-user-traffic-record.dto'
import type { UpdateUserTrafficRecordDto } from './dto/update-user-traffic-record.dto'

@Injectable()
export class UserTrafficRecordsService {
  create(createUserTrafficRecordDto: CreateUserTrafficRecordDto) {
    return createUserTrafficRecordDto
  }

  findAll() {
    return 'This action returns all userTrafficRecords'
  }

  findOne(id: number) {
    return `This action returns a #${id} userTrafficRecord`
  }

  update(id: number, updateUserTrafficRecordDto: UpdateUserTrafficRecordDto) {
    return updateUserTrafficRecordDto
  }

  remove(id: number) {
    return `This action removes a #${id} userTrafficRecord`
  }
}
