import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'

import { DictionaryItemsService } from './dictionary-items.service'
import { CreateDictionaryItemDto } from './dto/create-dictionary-item.dto'
import { UpdateDictionaryItemDto } from './dto/update-dictionary-item.dto'

@Controller('dictionary-items')
export class DictionaryItemsController {
  constructor(
    private readonly dictionaryItemsService: DictionaryItemsService
  ) {}

  @Post()
  create(@Body() createDictionaryItemDto: CreateDictionaryItemDto) {
    return this.dictionaryItemsService.create(createDictionaryItemDto)
  }

  @Get()
  findAll() {
    return this.dictionaryItemsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictionaryItemsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDictionaryItemDto: UpdateDictionaryItemDto
  ) {
    return this.dictionaryItemsService.update(+id, updateDictionaryItemDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictionaryItemsService.remove(+id)
  }
}
