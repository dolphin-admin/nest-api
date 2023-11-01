import { Injectable } from '@nestjs/common'

import type { CreateDictionaryItemDto } from './dto/create-dictionary-item.dto'
import type { UpdateDictionaryItemDto } from './dto/update-dictionary-item.dto'

@Injectable()
export class DictionaryItemsService {
  create(createDictionaryItemDto: CreateDictionaryItemDto) {
    return createDictionaryItemDto
  }

  findAll() {
    return 'This action returns all dictionaryItems'
  }

  findOne(id: number) {
    return `This action returns a #${id} dictionaryItem`
  }

  update(id: number, updateDictionaryItemDto: UpdateDictionaryItemDto) {
    return updateDictionaryItemDto
  }

  remove(id: number) {
    return `This action removes a #${id} dictionaryItem`
  }
}
