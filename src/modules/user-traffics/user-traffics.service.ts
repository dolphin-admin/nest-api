import { Injectable } from '@nestjs/common'

import type { CreateUserTrafficDto } from './dto/create-user-traffic.dto'
import type { UpdateUserTrafficDto } from './dto/update-user-traffic.dto'

@Injectable()
export class UserTrafficsService {
  create(createUserTrafficDto: CreateUserTrafficDto) {
    return createUserTrafficDto
  }

  findAll() {
    return 'This action returns all userTraffics'
  }

  findOne(id: number) {
    return `This action returns a #${id} userTraffic`
  }

  update(id: number, updateUserTrafficDto: UpdateUserTrafficDto) {
    return updateUserTrafficDto
  }

  remove(id: number) {
    return `This action removes a #${id} userTraffic`
  }
}
