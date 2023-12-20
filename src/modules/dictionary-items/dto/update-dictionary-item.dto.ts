import { OmitType } from '@nestjs/swagger'

import { CreateDictionaryItemDto } from './create-dictionary-item.dto'

export class UpdateDictionaryItemDto extends OmitType(CreateDictionaryItemDto, [
  'dictionaryId'
] as const) {}
