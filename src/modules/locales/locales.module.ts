import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { LocalesController } from './locales.controller'
import { LocalesService } from './locales.service'
import { Locale, LocaleSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Locale.name,
        schema: LocaleSchema
      }
    ])
  ],
  controllers: [LocalesController],
  providers: [LocalesService]
})
export class LocalesModule {}
