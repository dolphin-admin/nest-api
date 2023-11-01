import { Injectable } from '@nestjs/common'

import type { CreatePositionDto } from './dto/create-position.dto'
import type { UpdatePositionDto } from './dto/update-position.dto'

@Injectable()
export class PositionsService {
  create(createPositionDto: CreatePositionDto) {
    return createPositionDto
  }

  findAll() {
    return 'This action returns all positions'
  }

  findOne(id: number) {
    return `This action returns a #${id} position`
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return updatePositionDto
  }

  remove(id: number) {
    return `This action removes a #${id} position`
  }
}
