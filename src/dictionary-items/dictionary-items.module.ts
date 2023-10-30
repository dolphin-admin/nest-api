import { Module } from '@nestjs/common'

import { DictionaryItemsController } from './dictionary-items.controller'
import { DictionaryItemsService } from './dictionary-items.service'

@Module({
  controllers: [DictionaryItemsController],
  providers: [DictionaryItemsService]
})
export class DictionaryItemsModule {}
