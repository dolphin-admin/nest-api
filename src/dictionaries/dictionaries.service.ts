import { Injectable } from '@nestjs/common'

import { type PageDateDto } from '@/common'

import type { CreateDictionaryDto } from './dto/create-dictionary.dto'
import type { UpdateDictionaryDto } from './dto/update-dictionary.dto'

@Injectable()
export class DictionariesService {
  create(createDictionaryDto: CreateDictionaryDto) {
    return createDictionaryDto
  }

  findMany(pageDateDto: PageDateDto) {
    const { page, pageSize, searchText, startTime, endTime } = pageDateDto
    console.log(page, pageSize, searchText, startTime, endTime)
  }

  findOne(id: number) {
    return `This action returns a #${id} dictionary`
  }

  update(_id: number, updateDictionaryDto: UpdateDictionaryDto) {
    return updateDictionaryDto
  }

  remove(id: number) {
    return `This action removes a #${id} dictionary`
  }
}
