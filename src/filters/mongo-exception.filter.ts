import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'
import { MongoError } from 'mongodb'
import { I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import type { I18nTranslations } from '@/generated/i18n.generated'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const i18n = I18nContext.current<I18nTranslations>()!

    switch (exception.code) {
      case 11000:
        response
          .status(HttpStatus.CONFLICT)
          .json(new R({ msg: i18n.t('common.RESOURCE.CONFLICT') }))
        break
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json()
        break
    }
  }
}
